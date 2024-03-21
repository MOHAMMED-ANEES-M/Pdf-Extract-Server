const asyncHandler = require('express-async-handler');
const Pdf = require('../models/pdfModel');
const fs = require('fs');
const path = require('path');
const pdfServiceInterface = require('../services/pdfServiceInterface')
const pdfService = require('../services/pdfService')



// POST /api/pdf/upload
const uploadPdf = asyncHandler(async (req,res) => {
    const file = req.file.filename
    const userId = req.body.userId
    if( !file ) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    const pdfUpload = await Pdf.create({ pdf: file, userId: userId })
    if (pdfUpload) {   
        res.status(201).json({success: true, pdfUpload})
    } else {
        res.status(400);
        throw new Error('Error uploading pdf')
    }
})


// GET /api/pdf/
const fetchPdf = asyncHandler(async (req,res) => {
    const userId = req.user.id
    const fetchedPdf = await Pdf.findOne({ userId }).sort({ createdAt: -1 });
    if (fetchedPdf) {
        res.status(201).json({success: true, fetchedPdf})
    } else {
        res.status(400);
        throw new Error('Error fetching pdf')
    }
})


// POST /api/pdf/extract
const extractPdf = asyncHandler(async (req,res) => {     
    const { pdfFilePath, pages } = req.body;
    const extractPages = async (pdfFilePath, pages, pdfServiceInterface) => {
        const filePath = path.join(__dirname, '..', 'uploads', pdfFilePath);
        if (fs.existsSync(filePath)) {
            const pdfBytes = fs.readFileSync(filePath);
            let extractedPdf;  
            if (Array.isArray(pages)) {
                if (pages.length === 0) {
                    return res.status(400).json({ success: false, message: 'At least select a page to extract new pdf' });
                }
                extractedPdf = await pdfServiceInterface.extractRandomPages(pdfBytes, pages);
            } 
            const tempDir = path.join(__dirname, '..', 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            const tempFilePath = path.join(tempDir, pdfFilePath);
            fs.writeFileSync(tempFilePath, extractedPdf);
            const fileStream = fs.createReadStream(tempFilePath);
            fs.unlinkSync(filePath);
            return fileStream;
        }
    }
    const fileStream = await extractPages(pdfFilePath, pages, pdfServiceInterface(pdfService));
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200);
    fileStream.pipe(res); 
})



module.exports = { uploadPdf, fetchPdf, extractPdf }