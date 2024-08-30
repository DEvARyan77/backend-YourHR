const express = require('express');
const path = require('path');
const fs = require('fs');
const userModel = require('../Model/Signup');

const router = express.Router();

// Route to get all users and their associated experience and skills
router.get('/allresume', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userModel.find({hr: false});

        // Process each user's data
        const userDetails = users.map(user => {
            const username = user.Username;
            const experience = user.experience || 'No experience found';
            const skills = user.skills || 'No skills found';

            // Construct file URL
            const fileUrl = user.fileid ? `${req.protocol}://${req.get('host')}/downloads/${user.fileid}` : null;

            return { Username: username, skills, experience, fileUrl };
        });

        // Send the user details to the frontend
        res.json(userDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;
