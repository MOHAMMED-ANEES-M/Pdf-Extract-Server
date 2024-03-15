const express = require('express')
const dotenv = require('dotenv').config()
var cors = require('cors');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes')
const pdfRoutes = require('./routes/pdfRoutes')


connectDB()
const app=express()

const port = process.env.PORT || 5001

app.use(express.json())
app.use(cors())
app.use("/uploads",express.static("uploads"))

app.use("/api/users", userRoutes)
app.use("/api/pdf", pdfRoutes)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})