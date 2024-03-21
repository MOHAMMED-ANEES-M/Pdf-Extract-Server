const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const saltRounds = 10;
var jwt = require('jsonwebtoken');



// POST /api/users/register
const registerUser = asyncHandler(async (req,res) => {
    console.log(req.body,'register body');
    const { username, fname, lname, password, confirmpassword } = req.body
    if( !username || !fname || !lname || !password ) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    if( password !== confirmpassword) {
        res.status(400);
        throw new Error('Password mismatch')
    }
    const userExist = await User.findOne({username})
    if (userExist) {
        res.status(400);
        throw new Error('User already registered')
    }
    const hashedPassword = await bcrypt.hash( password, saltRounds )
    const user = await User.create({ username, fname, lname, password: hashedPassword })
    if (user) {   
        console.log('User registration success');
        res.status(201).json({success: true, user})
    } else {
        console.log('User data is invalid');
        res.status(400);
        throw new Error('User data is invalid')
    }
})


// POST /api/users/login
const loginUser = asyncHandler(async (req,res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({username})
    if ( user && (await bcrypt.compare( password, user.password ))) {
        const accessToken = jwt.sign(
             { user: { username: user.username, id: user.id }},
             process.env.ACCESS_TOKEN_SECRET,
             {expiresIn: '48h'})
        console.log('User login success');
        res.status(200).json({ token: accessToken, success: true, user })
    } else {
        console.log("Username or Password is not valid");
        res.status(404);
        throw new Error("Username or Password is not valid")
    }
})


// GET /api/users/current
const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user)
})



module.exports = { registerUser, loginUser, currentUser }