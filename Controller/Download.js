const path = require('path')
const userModel = require("../Model/Signup")
const fs =require('fs')

const download = async(req,res)=>{
    try {
        const username = req.body.username 
        const user = await userModel.findOne({ Username: username }) 
        if (!user || !user.fileid) {
            return res.status(404).send('No file associated with this user.') 
        }

        const filename = user.fileid 
        const filePath = path.join('/tmp', filename)

        if (fs.existsSync(filePath)) {
            res.download(filePath) 
        } else {
            res.status(404).send('File not found.') 
        }
    } catch (error) {
        console.error(error) 
        res.status(500).send('Internal server error.') 
    }
}

module.exports = download
