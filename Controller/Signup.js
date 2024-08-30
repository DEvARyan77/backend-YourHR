const userModel = require("../Model/Signup")
const bcrypt = require('bcrypt')

const Signup = async (req,res)=>{
    const {username,name,email,password} = req.body
    if (password.length<9){
        res.send("Length")
        return
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new userModel({
        Username: username,
        Password: hashedPassword,
        Email: email,
        Name: name,
        hr: false
    })
    user.save().then(()=>{
        res.send("Done")
    }).catch((err)=>{
        console.log(err)
        if (err.code === 11000){
            res.send("Username Exist")
        }
        else{
            res.send("Fields")
        }
    })
}

module.exports = Signup
