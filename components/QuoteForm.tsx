
import React, { useState, useCallback, useEffect } from 'react';
import { QuoteData, Client, Contact, Currency, PlanType } from '../types';
import { fetchCurrencyValues, CurrencyValues } from '../services/currencyService';

interface QuoteFormProps {
    quoteData: QuoteData;
    updateQuoteField: <K extends keyof QuoteData>(field: K, value: QuoteData[K]) => void;
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    deviceTypes: string[];
    setDeviceTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

const InputField: React.FC<{label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, required?: boolean}> = 
({ label, value, onChange, type = 'text', placeholder, required = false }) => (
    <div>
        <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[--primary-color] focus:border-[--primary-color] transition"
        />
    </div>
);

const SelectField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode, required?: boolean}> =
({ label, value, onChange, children, required = false }) => (
    <div>
        <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[--primary-color] focus:border-[--primary-color] transition"
        >
            {children}
        </select>
    </div>
);

export const QuoteForm: React.FC<QuoteFormProps> = ({ quoteData, updateQuoteField, clients, setClients, deviceTypes, setDeviceTypes }) => {
    const [currencyValues, setCurrencyValues] = useState<CurrencyValues | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    
    const [newClientName, setNewClientName] = useState('');
    const [newContact, setNewContact] = useState({name: '', phone: '', email: ''});
    const [newDeviceType, setNewDeviceType] = useState('');

    const handleFetchCurrencies = useCallback(async () => {
        setIsFetching(true);
        const values = await fetchCurrencyValues();
        setCurrencyValues(values);
        updateQuoteField('ufValue', values.uf);
        updateQuoteField('usdValue', values.dolar);
        setIsFetching(false);
    }, [updateQuoteField]);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        if (clientId === 'new') {
            updateQuoteField('client', { id: 'new', name: '', contacts: [] });
            updateQuoteField('contact', { id: '', name: '', phone: '', email: '' });
        } else {
            const selectedClient = clients.find(c => c.id === clientId) || { id: '', name: '', contacts: [] };
            updateQuoteField('client', selectedClient);
            updateQuoteField('contact', { id: '', name: '', phone: '', email: '' });
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const contactId = e.target.value;
        if (contactId === 'new') {
            updateQuoteField('contact', { id: 'new', name: '', phone: '', email: ''});
        } else {
            const selectedContact = quoteData.client.contacts.find(c => c.id === contactId) || { id: '', name: '', phone: '', email: ''};
            updateQuoteField('contact', selectedContact);
        }
    };
    
    const handleAddNewClient = () => {
        if(newClientName.trim()){
            const newClient: Client = { id: Date.now().toString(), name: newClientName.trim(), contacts: [] };
            setClients(prev => [...prev, newClient]);
            updateQuoteField('client', newClient);
            setNewClientName('');
        }
    };

    const handleAddNewContact = () => {
        if(newContact.name.trim() && quoteData.client.id && quoteData.client.id !== 'new') {
             const newContactData: Contact = { ...newContact, id: Date.now().toString() };
             const updatedClients = clients.map(c => 
                c.id === quoteData.client.id ? { ...c, contacts: [...c.contacts, newContactData] } : c
             );
             setClients(updatedClients);
             updateQuoteField('client', updatedClients.find(c => c.id === quoteData.client.id)!);
             updateQuoteField('contact', newContactData);
             setNewContact({name: '', phone: '', email: ''});
        }
    };
    
    const handleDeviceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'new') {
            updateQuoteField('deviceType', 'new');
        } else {
            updateQuoteField('deviceType', value);
        }
    };

    const handleAddNewDeviceType = () => {
        if (newDeviceType.trim() && !deviceTypes.includes(newDeviceType.trim())) {
            const newTypes = [...deviceTypes, newDeviceType.trim()];
            setDeviceTypes(newTypes);
            updateQuoteField('deviceType', newDeviceType.trim());
            setNewDeviceType('');
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-[--primary-color] pb-2">Datos de la Cotización</h2>
            
            <InputField label="Número Cotización" value={quoteData.quoteNumber} onChange={(e) => updateQuoteField('quoteNumber', e.target.value)} />
            
            <InputField label="Fecha Cotización" type="date" value={quoteData.quoteDate.toISOString().split('T')[0]} onChange={(e) => updateQuoteField('quoteDate', new Date(e.target.value))} />
           
            {/* Client Management */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Cliente y Contacto</h3>
                <SelectField label="Cliente" value={quoteData.client.id} onChange={handleClientChange}>
                    <option value="" disabled>Seleccione un cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="new">-- Agregar Nuevo Cliente --</option>
                </SelectField>

                {quoteData.client.id === 'new' && (
                     <div className="flex items-end gap-2">
                        <InputField label="Nuevo Cliente" value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="Nombre del cliente"/>
                        <button onClick={handleAddNewClient} className="bg-[--primary-color] text-white px-4 py-2 rounded-md h-fit">Guardar</button>
                    </div>
                )}
                
                {quoteData.client.id && quoteData.client.id !== 'new' && (
                    <SelectField label="Contacto" value={quoteData.contact.id} onChange={handleContactChange}>
                        <option value="" disabled>Seleccione un contacto</option>
                        {quoteData.client.contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        <option value="new">-- Agregar Nuevo Contacto --</option>
                    </SelectField>
                )}

                {quoteData.contact.id === 'new' && quoteData.client.id && quoteData.client.id !== 'new' && (
                     <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <InputField label="Nombre Contacto" value={newContact.name} onChange={e => setNewContact(p=>({...p, name: e.target.value}))} placeholder="Nombre"/>
                        <InputField label="Teléfono" value={newContact.phone} onChange={e => setNewContact(p=>({...p, phone: e.target.value}))} placeholder="Teléfono"/>
                        <InputField label="Correo" value={newContact.email} onChange={e => setNewContact(p=>({...p, email: e.target.value}))} placeholder="Correo"/>
                        <button onClick={handleAddNewContact} className="bg-[--primary-color] text-white px-4 py-2 rounded-md mt-2">Guardar Contacto</button>
                    </div>
                )}

            </div>

            {/* Service Details */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Detalles del Servicio</h3>
                <SelectField label="Tipo de Plan" value={quoteData.planType} onChange={(e) => updateQuoteField('planType', e.target.value as PlanType)}>
                    {Object.values(PlanType).map(plan => <option key={plan} value={plan}>{plan}</option>)}
                </SelectField>
                
                <SelectField label="Tipo de Dispositivo" value={quoteData.deviceType} onChange={handleDeviceTypeChange}>
                    {deviceTypes.map(d => <option key={d} value={d}>{d}</option>)}
                    <option value="new">-- Agregar Nuevo Dispositivo --</option>
                </SelectField>

                {quoteData.deviceType === 'new' && (
                    <div className="flex items-end gap-2">
                        <InputField label="Nuevo Dispositivo" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} placeholder="Nombre del dispositivo"/>
                        <button onClick={handleAddNewDeviceType} className="bg-[--primary-color] text-white px-4 py-2 rounded-md h-fit">Guardar</button>
                    </div>
                )}
            </div>
            
            {/* Currency and Values */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                 <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Moneda y Valores</h3>
                <SelectField label="Moneda de Cotización" value={quoteData.currency} onChange={(e) => updateQuoteField('currency', e.target.value as Currency)}>
                    {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                {quoteData.currency !== Currency.CLP && (
                     <div className="flex items-center gap-4">
                        <button onClick={handleFetchCurrencies} disabled={isFetching} className="bg-[--secondary-color] text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {isFetching ? 'Consultando...' : 'Consultar Valores'}
                        </button>
                        {currencyValues && (
                            <div className="text-base text-gray-700 dark:text-gray-300">
                                {quoteData.currency === Currency.UF && `Valor UF: $${currencyValues.uf.toLocaleString('es-CL')}`}
                                {quoteData.currency === Currency.USD && `Valor Dólar: $${currencyValues.dolar.toLocaleString('es-CL')}`}
                            </div>
                        )}
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Cant. Monitoreo" type="number" value={quoteData.monitoringQty} onChange={(e) => updateQuoteField('monitoringQty', parseInt(e.target.value, 10) || 0)} />
                    <InputField label={`*Valor Monitoreo (${quoteData.currency})`} type="number" value={quoteData.monitoringValue} onChange={(e) => updateQuoteField('monitoringValue', parseFloat(e.target.value) || 0)} />
                    <InputField label="Cant. Instalación" type="number" value={quoteData.installationQty} onChange={(e) => updateQuoteField('installationQty', parseInt(e.target.value, 10) || 0)} />
                    <InputField label={`*Valor Instalación (${quoteData.currency})`} type="number" value={quoteData.installationValue} onChange={(e) => updateQuoteField('installationValue', parseFloat(e.target.value) || 0)} />
                </div>

            </div>

        </div>
    );
};