// auth , isStudent and isAdmin

const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth =(req,res,next)=>{
    try {
        // extract jwt token
        console.log("cookie ",req.cookies.token);
        console.log("body ",req.body.token);
        console.log("header ",req.header('Authorization'));
        const token = req.cookies.token || req.body.token || req.header('Authorization').replace("Bearer ","") ;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found"
            }) 
        }

        //verify token
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user=payload; 
        } catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid" 
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            console: error.message,
            message:"something went wrong during verification"
        })
    }
}

exports.isStudent =(req, res, next)=>{
    try {
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for students only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong during role matching"
        })
    }
}

exports.isAdmin =(req, res, next)=>{
    try {
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong during role matching"
        })
    }
}