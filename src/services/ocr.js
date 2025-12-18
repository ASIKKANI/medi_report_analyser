import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker (essential for pdf.js to work in browser)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export const extractTextFromImage = async (imageFile, onProgress) => {
    try {
        const worker = await Tesseract.createWorker('eng', 1, {
            logger: m => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(m.progress);
                }
            }
        });

        const { data: { text } } = await worker.recognize(imageFile);
        await worker.terminate();
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image.");
    }
};

export const extractTextFromPDF = async (pdfFile, onProgress) => {
    try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
            if (onProgress) onProgress((i - 1) / totalPages); // Approximate progress

            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');

            // If text is sufficient, use it. Otherwise, render and OCR.
            if (pageText.trim().length > 50) {
                fullText += `[Page ${i}]\n${pageText}\n\n`;
            } else {
                console.log(`Page ${i} appears to be an image. Running OCR...`);
                
                // Render page to canvas
                const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                // Convert canvas to blob/file
                const blob = await new Promise(resolve => canvas.toBlob(resolve));
                
                // OCR the page image
                // We use a simplified progress callback or null to avoid messing up the main progress bar too much
                const ocrText = await extractTextFromImage(blob, null); 
                fullText += `[Page ${i} (OCR)]\n${ocrText}\n\n`;
            }
        }
        
        if (onProgress) onProgress(1);
        return fullText;

    } catch (error) {
        console.error("PDF Processing Error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
};

export const processFile = async (file, onProgress) => {
    if (file.type === 'application/pdf') {
        return extractTextFromPDF(file, onProgress);
    } else if (file.type.startsWith('image/')) {
        return extractTextFromImage(file, onProgress);
    } else {
        throw new Error("Unsupported file type. Please upload an Image or PDF.");
    }
};
