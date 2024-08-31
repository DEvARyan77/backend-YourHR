const express = require('express')
const userModel = require('../Model/Signup')

const router = express.Router()
router.get('/allresume', async (req, res) => {
    try {
        const users = await userModel.find({hr: false})
        const userDetails = users.map(user => {
            const username = user.Username
            const experience = user.experience || 'No experience found'
            const skills = user.skills || 'No skills found'
            const fileUrl = user.fileid ? `${req.protocol}://${req.get('host')}/downloads/${user.fileid}` : null

            return { Username: username, skills, experience, fileUrl }
        })
        res.json(userDetails)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error.')
    }
})

module.exports = router
