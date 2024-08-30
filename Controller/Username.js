const userModel = require("../Model/Signup")
const jsonwebtoken = require('jsonwebtoken')

const Username = async(req,res)=>{
    const UserDetails = jsonwebtoken.verify(req.body.username,"TOKEN")
    const User = await userModel.findOne({Username:UserDetails})
    if (!User){
        res.send("Not Exist")
        return
    }
    res.json({
            username: User.Username,
            email: User.Email,
            skills: User.skills,
            experience: User.experience,
            fileid: User.fileid,
            hr: User.hr
        })
}

module.exports = Username
