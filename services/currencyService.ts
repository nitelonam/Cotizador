
export interface CurrencyValues {
    uf: number;
    dolar: number;
}

export const fetchCurrencyValues = async (): Promise<CurrencyValues> => {
    try {
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const ufValue = data.uf?.valor;
        const dolarValue = data.dolar?.valor;
        
        if (typeof ufValue !== 'number' || typeof dolarValue !== 'number') {
            throw new Error('Invalid currency data format');
        }

        return {
            uf: ufValue,
            dolar: dolarValue,
        };
    } catch (error) {
        console.error("Failed to fetch currency values:", error);
        // Return default/fallback values in case of an error
        return {
            uf: 0,
            dolar: 0,
        };
    }
};
