const express =require('express');
const router = express.Router();

const {login,signup}=require('../controller/Auth');
const {auth,isStudent,isAdmin}=require('../middleware/auth');
const User = require('../model/User');

router.post('/signup',signup);
router.post('/login',login);

router.get('/test',auth,(req,res) => {
    res.json({
        success:true,
        message:"protected route"
    })
});
//protected routes
router.get('/student',auth,isStudent,(req,res) => {
    res.json({
        success:true,
        message:"Student only router"
    })
});

router.get('/admin',auth,isAdmin,(req,res) => {
    res.json({
        success:true,
        message:"Admin only router"
    })
});

// router.get("/getEmail",auth,async (req,res)=>{
//     try {
//         const id=req.user.id;
//         const user=await User.findById({_id:id});
//         res.status(200).json({
//             success:true,
//             message:"get mail router",
//             user:user
//         })
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:"failure",
//             error:error.message
//         })
//     }
    
// });

module.exports=router;