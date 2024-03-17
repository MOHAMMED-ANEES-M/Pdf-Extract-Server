const asyncHandler = require('express-async-handler');
const Pdf = require('../models/pdfModel');
const pdfLib = require('pdf-lib');
// const fs = require('fs').promises;
const fs = require('fs');
const { PdfDocument } = require("@ironsoftware/ironpdf");
const PDFDocument = require('pdf-lib').PDFDocument;
const path = require('path');




// POST /api/pdf/upload
const uploadPdf = asyncHandler(async (req,res) => {
    // console.log(req.body.userId,'upload file body');
    const file = req.file.filename
    const userId = req.body.userId
    if( !file ) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    const pdfUpload = await Pdf.create({ pdf: file, userId: userId })
    if (pdfUpload) {   
        console.log('Pdf uploaded',pdfUpload);
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
        console.log(fetchedPdf,'fetched pdf');
        res.status(201).json({success: true, fetchedPdf})
    } else {
        res.status(400);
        throw new Error('Error fetching pdf')
    }
})


// POST /api/pdf/extract
const extractPdf = asyncHandler(async (req,res) => {
    const { pdfFilePath, pages } = req.body;
    console.log(req.body);

     // Construct the full path to the PDF file
     const filePath = path.join(__dirname, '..', 'uploads', pdfFilePath);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist or is not accessible
            console.error('Error accessing PDF file:', err);
            return res.status(400).json({ success: false, message: 'PDF file does not exist or is not accessible.' });
        }
        
         // File exists and is accessible
         console.log('PDF file exists and is accessible.');
         // Proceed with your logic here
     });

     const pdfBytes = await fs.promises.readFile(filePath);
     const pdfDoc = await PDFDocument.load(pdfBytes);

     // Remove the specified page
     pdfDoc.removePage(1); // Adjust page index
     
     const modifiedPdfBytes = await pdfDoc.save();
     res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-Disposition', 'attachment; filename="modified-pdf.pdf"');
     res.send(modifiedPdfBytes);
        // res.status(201).json({ success: true, outputPath });
    // res.send(newPdfBytes);

})




module.exports = { uploadPdf, fetchPdf, extractPdf }