const userModel = require("../Model/Signup")
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Login = async (req,res)=>{
    const User = await userModel.findOne({Username:req.body.username})
    if (!User){
        res.send("Not Exist")
        return
    }
    const validate = await bcrypt.compare(req.body.password,User.Password)
    if(!validate){
        res.send("Password")
        return
    }
    const token = await jsonwebtoken.sign(User.Username,"TOKEN")
    res.send(token)
}

module.exports = Login
