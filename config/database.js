const mongoose=require('mongoose');

require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log('Connected to MongoDB'))
    .catch((error)=>{
        console.log('Error connecting to MongoDB');
        console.log(error.message);
        process.exit(1);
    })
}