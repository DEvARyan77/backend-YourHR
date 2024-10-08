const express = require('express') 
const path = require('path') 
const fs = require('fs') 

const DownloadAll = (req, res) => {
    try {
        const filename = req.params.filename 
        const filePath = path.join('/tmp', filename) 

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath)
        } else {
            res.status(404).send('File not found.') 
        }
    } catch (error) {
        console.error(error) 
        res.status(500).send('Internal server error.') 
    }
}

module.exports = DownloadAll 
