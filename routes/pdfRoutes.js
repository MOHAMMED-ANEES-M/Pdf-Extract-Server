const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyTokenHandler');
const { uploadPdf, fetchPdf } = require('../controllers/pdfController');
const upload = require('../middleware/multer');



router.post("/upload", verifyToken, upload.single('file'), uploadPdf);
router.get("/", verifyToken, fetchPdf);


module.exports = router