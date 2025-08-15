import React, { useRef, useCallback } from 'react';
import { Palette } from '../types';

// Declare ColorThief for TypeScript, as it's loaded globally from a script tag in index.html
declare class ColorThief {
    getColor(sourceImage: HTMLImageElement | HTMLCanvasElement, quality?: number): [number, number, number];
    getPalette(sourceImage: HTMLImageElement | HTMLCanvasElement, colorCount?: number, quality?: number): Array<[number, number, number]>;
}

interface HeaderProps {
    setLogo: (logo: string) => void;
    setPalette: (palette: Palette) => void;
}

export const Header: React.FC<HeaderProps> = ({ setLogo, setPalette }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setLogo(imageUrl);

                const img = new Image();
                img.onload = () => {
                    try {
                        const colorThief = new ColorThief();
                        const dominantColor = colorThief.getColor(img);
                        const palette = colorThief.getPalette(img, 2);
                        const secondaryColor = palette.find(color => 
                            Math.abs(color[0] - dominantColor[0]) > 20 || 
                            Math.abs(color[1] - dominantColor[1]) > 20 || 
                            Math.abs(color[2] - dominantColor[2]) > 20
                        ) || [100, 116, 139]; // fallback gray

                        setPalette({
                            primary: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
                            secondary: `rgb(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]})`,
                        });
                    } catch(error) {
                        console.error("Error extracting colors: ", error);
                        // Fallback palette
                        setPalette({ primary: '#4f46e5', secondary: '#64748b' });
                    }
                };
                img.crossOrigin = "Anonymous"; // Handle CORS for images from other origins if needed
                img.src = imageUrl;
            };
            reader.readAsDataURL(file);
        }
    }, [setLogo, setPalette]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[--primary-color] transition-colors duration-500">
                    Generador de Cotizaciones
                </h1>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                    />
                    <button
                        onClick={handleButtonClick}
                        className="bg-[--secondary-color] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.293 6.707z" clipRule="evenodd" />
                        </svg>
                        Subir Logo
                    </button>
                </div>
            </div>
        </header>
    );
};