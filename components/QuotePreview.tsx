import React from 'react';
import { QuoteData, PlanType, Currency } from '../types';
import { COMPANY_INFO, FOOTER_MESSAGES, IVA_RATE } from '../constants';

interface QuotePreviewProps {
    data: QuoteData;
    logo: string | null;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ data, logo }) => {
    const monitoringSubtotal = data.monitoringQty * data.monitoringValue;
    const installationSubtotal = data.installationQty * data.installationValue;
    const netAmountInSelectedCurrency = monitoringSubtotal + installationSubtotal;
    
    let netAmountCLP: number;
    switch (data.currency) {
        case Currency.UF:
            netAmountCLP = netAmountInSelectedCurrency * data.ufValue;
            break;
        case Currency.USD:
            netAmountCLP = netAmountInSelectedCurrency * data.usdValue;
            break;
        default: // CLP
            netAmountCLP = netAmountInSelectedCurrency;
            break;
    }

    const ivaCLP = netAmountCLP * IVA_RATE;
    const totalCLP = netAmountCLP + ivaCLP;

    const currencySymbol = data.currency === 'CLP' ? '' : data.currency;

    const renderValue = (value: number) => {
        if (data.currency === 'CLP') {
             return value.toLocaleString('es-CL');
        }
        return value.toLocaleString('de-DE');
    }
    
    const formatCLP = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Math.round(value));
    };

    return (
        <div id="quote-preview" className="bg-white text-gray-900 shadow-2xl rounded-lg p-10 aspect-[210/297] overflow-auto">
            <div className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="w-2/3">
                    <h1 className="text-4xl font-bold text-gray-900">COTIZACIÓN</h1>
                    <p className="text-gray-700 mt-1">Número: {data.quoteNumber}</p>
                </div>
                <div className="w-1/3 flex justify-end">
                    {logo && <img src={logo} alt="Company Logo" className="max-h-20" />}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                    <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider">CLIENTE</h2>
                    <p className="font-bold text-gray-900">{data.client.name || 'Nombre Cliente'}</p>
                    {data.contact.name && <p className="text-gray-700">{data.contact.name}</p>}
                    {data.contact.phone && <p className="text-gray-700">{data.contact.phone}</p>}
                    {data.contact.email && <p className="text-gray-700">{data.contact.email}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider">FECHA</h2>
                    <p className="font-bold text-gray-900">{new Date(data.quoteDate).toLocaleDateString('es-CL')}</p>
                     <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider mt-2">PLAN</h2>
                    <p className="font-bold text-gray-900">{data.planType}</p>
                </div>
            </div>

            <div className="mt-8">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-base font-semibold uppercase tracking-wider text-left">Descripción</th>
                            <th className="p-3 text-base font-semibold uppercase tracking-wider text-center">Cantidad</th>
                            <th className="p-3 text-base font-semibold uppercase tracking-wider text-right">*Valor Unitario ({currencySymbol})</th>
                            <th className="p-3 text-base font-semibold uppercase tracking-wider text-right">Subtotal ({currencySymbol})</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="p-3 text-gray-900">Servicio de Monitoreo ({data.deviceType})</td>
                            <td className="p-3 text-center text-gray-900">{data.monitoringQty}</td>
                            <td className="p-3 text-right text-gray-900">{renderValue(data.monitoringValue)}</td>
                            <td className="p-3 text-right text-gray-900">{renderValue(monitoringSubtotal)}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="p-3 text-gray-900">Servicio de Instalación ({data.deviceType})</td>
                            <td className="p-3 text-center text-gray-900">{data.installationQty}</td>
                            <td className="p-3 text-right text-gray-900">{renderValue(data.installationValue)}</td>
                            <td className="p-3 text-right text-gray-900">{renderValue(installationSubtotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-8">
                <div className="w-1/2">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">Monto Neto (CLP)</span>
                        <span className="font-bold text-gray-900">{formatCLP(netAmountCLP)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">IVA (19%) (CLP)</span>
                        <span className="font-bold text-gray-900">{formatCLP(ivaCLP)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-gray-100 px-3 mt-2 rounded-md">
                        <span className="font-bold text-xl text-gray-900">TOTAL (CLP)</span>
                        <span className="font-bold text-xl text-gray-900">{formatCLP(totalCLP)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t-2 border-gray-200 text-sm text-gray-600">
                <p className="font-semibold">Datos para Transferencia:</p>
                <p>Razón Social: {COMPANY_INFO.name}</p>
                <p>RUT: {COMPANY_INFO.rut}</p>
                <p>Cuenta Corriente: {COMPANY_INFO.account}</p>
                <p>Banco: {COMPANY_INFO.bank}</p>
                <p>Correo: {COMPANY_INFO.email}</p>

                <div className="mt-4 italic">
                    <p>{FOOTER_MESSAGES.noIva}</p>
                    <p>{FOOTER_MESSAGES.validity}</p>
                    <p className="font-bold">{data.planType === PlanType.FULL ? FOOTER_MESSAGES.fullPlan : FOOTER_MESSAGES.basicPlan}</p>
                </div>
            </div>
        </div>
    );
};