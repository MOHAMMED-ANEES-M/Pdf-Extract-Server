const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyTokenHandler');
const { uploadPdf, fetchPdf, extractPdf } = require('../controllers/pdfController');
const upload = require('../middleware/multer');


router.post("/upload", verifyToken, upload.single('file'), uploadPdf);
router.post("/extract", verifyToken, upload.single('file'), extractPdf);
router.get("/", verifyToken, fetchPdf);


module.exports = router