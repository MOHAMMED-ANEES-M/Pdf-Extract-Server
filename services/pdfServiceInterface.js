const pdfService = require('./pdfService');


const pdfServiceInterface = () => {
    const service = pdfService();

    const countPages = async (pdfBuffer) => {
        return await service.countPages(pdfBuffer);
    };

    const extractRandomPages = async (pdfBuffer, pages) => {
        return await service.extractRandomPages(pdfBuffer, pages);
    };

    return {
        countPages,
        extractRandomPages
    };
};


module.exports = pdfServiceInterface;