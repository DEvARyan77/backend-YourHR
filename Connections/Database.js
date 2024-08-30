const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
console.log(process.env.MONGODBURL);

mongoose.connect(process.env.MONGODBURL,{dbName:'YourHR'}).then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log(err)
})