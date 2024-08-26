const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT ||4000;

//cookie-parser
const cookieParser=require('cookie-parser');
app.use(cookieParser());


app.use(express.json());

require('./config/database').connect();

const user=require('./routes/user');
app.use("/api/v1",user);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);  
})