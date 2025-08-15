
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  contacts: Contact[];
}

export enum Currency {
  CLP = 'CLP',
  USD = 'USD',
  UF = 'UF',
}

export enum PlanType {
  BASICO = 'Plan Básico',
  FULL = 'Plan Full',
}

export interface QuoteData {
  quoteNumber: string;
  client: Client;
  contact: Contact;
  quoteDate: Date;
  planType: PlanType;
  currency: Currency;
  monitoringQty: number;
  monitoringValue: number;
  installationQty: number;
  installationValue: number;
  deviceType: string;
  ufValue: number;
  usdValue: number;
}

export interface Palette {
    primary: string;
    secondary: string;
}
