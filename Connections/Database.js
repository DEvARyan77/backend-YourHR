const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.MONGODB_URL,{dbName:'YourHR'}).then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log(err)
})