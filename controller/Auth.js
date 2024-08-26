const bcrypt=require("bcrypt");
const User=require('../model/User');
const jwt=require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req,res) => {
    try {
        const {name,email,password,role}=req.body;
        //check if user is already registered
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already Exists"
            })
        }
        //secure password
        let hashedPassword ;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        } 
        catch(err){
            return res.status(400).json({
                success:false,
                message:"Error"
            })
        }
        const user=await User.create({
            name,email,password:hashedPassword,role
        })
        return res.status(200).json({
            user,
            success:true,
            message:"User registered successfully"
        })
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user can't be registered , please try again later"
        })
    }
}

exports.login = async (req,res) =>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Please provide email and password"
            });
        }

        let user= await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const payload={
            email: user.email,
            id:user._id,
            role:user.role
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
            let token = jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn:process.env.JWT_EXPIRATION_TIME
                }
            )
            user=user.toObject();
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                message:"User logged in successfully",
                user
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Email or password does not match",
            })
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}