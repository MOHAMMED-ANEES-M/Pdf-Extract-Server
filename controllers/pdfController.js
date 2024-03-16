const asyncHandler = require('express-async-handler');
const Pdf = require('../models/pdfModel');



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



module.exports = { uploadPdf, fetchPdf }