const express = require('express') 
const fs = require('fs') 
const path = require('path') 
const pdf = require('pdf-parse') 
const multer = require('multer') 
const mammoth = require('mammoth')
const userModel = require("../Model/Signup")

const router = express.Router() 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('/tmp'))
    },
    filename: (req, file, cb) => {
        cb(null, `file-${Date.now()}-${file.originalname}`) 
    }
}) 
const upload = multer({ storage })
const readPdfContent = async (filePath) => {
    const data = await fs.promises.readFile(filePath) 
    const pdfData = await pdf(data) 
    return pdfData.text 
} 
const readDocxContent = async (filePath) => {
    try {
        const data = await fs.promises.readFile(filePath) 
        const result = await mammoth.extractRawText({ buffer: data }) 
        return result.value 
    } catch (error) {
        console.error('Error reading DOCX file:', error) 
        throw error 
    }
} 
const readFileContent = async (filePath) => {
    return await fs.promises.readFile(filePath, 'utf8') 
} 

const analyzeResume = async (filePath) => {
    const extname = path.extname(filePath).toLowerCase() 
    let content = '' 

    if (extname === '.pdf') {
        content = await readPdfContent(filePath) 
    } else if (extname === '.docx') {
        content = await readDocxContent(filePath) 
    } else if (extname === '.txt') {
        content = await readFileContent(filePath) 
    }

    return content 
} 
const extractExperience = (text) => {
    const experiencePattern = /(?:experience|work\s+history|previous\s+positions|work\s+experience)([\s\S]*?)(?:education|skills|certifications|$)/i 
    const match = text.match(experiencePattern) 
    return match ? match[1].trim() : 'No experience found' 
} 
const extractSkills = (text) => {
    const skillsPattern = /(?:skills|technical\s+skills|proficiencies|competencies|expertise)([\s\S]*?)(?:experience|education|certifications|$)/i 
    const match = text.match(skillsPattern) 

    if (match) {
        let skillsText = match[1].trim() 
        skillsText = skillsText.replace(/(?:Skills|Technical Skills|Competencies|Proficiencies|Expertise):?\s*/i, '')
        const skillsList = skillsText.split(/,\s*|\n\s*/).map(skill => skill.trim()).filter(skill => skill.length > 0) 

        return skillsList.join(', ')
    } else {
        return 'No skills found' 
    }
} 
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.') 
        }

        const filename = req.file.filename 
        const username = req.body.username
        if (!username) {
            return res.status(400).send('Username is required.') 
        }
        const user = await userModel.findOne({ Username: username }) 
        if (user && user.fileid) {
            const oldFilePath = path.join('/tmp', user.fileid) 
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath) 
            }
        }

        const filePath = path.join('/tmp', filename) 
        const resumeContent = await analyzeResume(filePath) 
        const experience = extractExperience(resumeContent) 
        const skills = extractSkills(resumeContent) 
        const updatedUser = await userModel.findOneAndUpdate(
            { Username: username },
            { fileid: filename, experience: experience, skills: skills },
            { new: true }
        ) 

        if (!updatedUser) {
            return res.status(404).send('User not found.') 
        }

        res.send("Done") 
    } catch (error) {
        console.error(error) 
        res.status(500).send(error) 
    }
}) 

module.exports = router 
