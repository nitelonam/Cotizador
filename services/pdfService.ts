// Type declarations for libraries loaded via script tags in index.html
declare const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;

declare global {
    interface Window {
        jspdf: {
            jsPDF: new (options?: any) => any;
        };
    }
}

export const exportToPdf = (elementId: string, fileName: string): void => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    const { jsPDF } = window.jspdf;

    html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        const width = pdfWidth;
        const height = width / ratio;

        // If height is bigger than page, scale down
        if (height > pdfHeight) {
            const newHeight = pdfHeight;
            const newWidth = newHeight * ratio;
            pdf.addImage(imgData, 'PNG', (pdfWidth - newWidth) / 2, 0, newWidth, newHeight);
        } else {
             pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        }
       
        pdf.save(fileName);
    });
};