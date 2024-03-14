const express = require('express')
const dotenv = require('dotenv').config()
var cors = require('cors');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes')


connectDB()
const app=express()

const port = process.env.PORT || 5001

app.use(express.json())
app.use(cors())

app.use("/api/users", userRoutes)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})