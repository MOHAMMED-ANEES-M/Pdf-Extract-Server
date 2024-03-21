const asyncHandler = require('express-async-handler');
var jwt = require('jsonwebtoken');


const verifyToken = asyncHandler(async (req,res,next) => {
    let token;
    authHeader = req.headers.Authorization || req.headers.authorization 
    if(!authHeader){
        res.status(404)
        throw new Error("Token is not provided")
    }
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                console.log('token err');
                res.status(401)
                throw new Error("Unauthorized: Invalid token")
            }
            req.user = decoded.user
            next();
        });
        
    }; 
});


module.exports = verifyToken;