
import React, { useState, useEffect, useCallback } from 'react';
import { QuoteData, Client, Contact, Currency, PlanType, Palette } from './types';
import { QuoteForm } from './components/QuoteForm';
import { QuotePreview } from './components/QuotePreview';
import { Header } from './components/Header';
import { useThemeUpdater } from './hooks/useThemeUpdater';
import { exportToPdf } from './services/pdfService';

const App: React.FC = () => {
    const [logo, setLogo] = useState<string | null>(null);
    const [palette, setPalette] = useState<Palette>({ primary: '#4f46e5', secondary: '#64748b' });

    useThemeUpdater(palette);

    const [quoteData, setQuoteData] = useState<QuoteData>({
        quoteNumber: '1001',
        client: { id: '', name: '', contacts: [] },
        contact: { id: '', name: '', phone: '', email: '' },
        quoteDate: new Date(),
        planType: PlanType.BASICO,
        currency: Currency.CLP,
        monitoringQty: 1,
        monitoringValue: 0,
        installationQty: 1,
        installationValue: 0,
        deviceType: 'GPS Tracker X1',
        ufValue: 0,
        usdValue: 0,
    });
    
    const [clients, setClients] = useState<Client[]>([]);
    const [deviceTypes, setDeviceTypes] = useState<string[]>(['GPS Tracker X1', 'Sensor de Temperatura', 'Cámara de cabina']);

    const handleGeneratePdf = () => {
        const date = new Date(quoteData.quoteDate).toLocaleDateString('es-CL');
        const clientName = quoteData.client.name.replace(/\s/g, '_');
        const fileName = `Cotizacion_${quoteData.quoteNumber}_${clientName}_${date}.pdf`;
        exportToPdf('quote-preview', fileName);
    };

    const updateQuoteField = useCallback(<K extends keyof QuoteData>(field: K, value: QuoteData[K]) => {
        setQuoteData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
            <Header setLogo={setLogo} setPalette={setPalette} />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <QuoteForm 
                            quoteData={quoteData}
                            updateQuoteField={updateQuoteField}
                            clients={clients}
                            setClients={setClients}
                            deviceTypes={deviceTypes}
                            setDeviceTypes={setDeviceTypes}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <div className="sticky top-8">
                           <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleGeneratePdf}
                                    className="bg-[--primary-color] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                    </svg>
                                    Exportar a PDF
                                </button>
                            </div>
                            <QuotePreview logo={logo} data={quoteData} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;