const { PDFDocument } = require('pdf-lib');


const pdfService = () => {
    const countPages = async (pdfBuffer) => {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPages().length;
        return pageCount;
    };

    const extractRandomPages = async (pdfBuffer, randomPageNumbers) => {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const extractedDoc = await PDFDocument.create();
        for (const pageNumber of randomPageNumbers) {
            if (pageNumber >= 1 && pageNumber <= pdfDoc.getPageCount()) {
                const [copiedPage] = await extractedDoc.copyPages(pdfDoc, [pageNumber - 1]);
                extractedDoc.addPage(copiedPage);
            }
        }
        return extractedDoc.save();
    };

    return {
        countPages,
        extractRandomPages,
    };
};


module.exports = pdfService;
