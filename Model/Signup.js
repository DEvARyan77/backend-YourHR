const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        unique: true,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    Password: {
        type: String,
        required: true,
    },
    fileid:{
        type:String
    },
    skills:{
        type: String
    },
    experience:{
        type: String
    },
    hr:{
        type:Boolean
    }
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
