
import { useEffect } from 'react';
import { Palette } from '../types';

export const useThemeUpdater = (palette: Palette) => {
    useEffect(() => {
        const root = document.documentElement;
        if (palette.primary) {
            root.style.setProperty('--primary-color', palette.primary);
        }
        if (palette.secondary) {
            root.style.setProperty('--secondary-color', palette.secondary);
        }
    }, [palette]);
};
