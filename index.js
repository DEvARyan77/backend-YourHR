const express = require('express');
const Login = require('./Controller/Login');
const Signup = require('./Controller/Signup');
const upload = require('./Controller/upload');
const Download = require('./Controller/Download');
const Username = require('./Controller/Username');
const DownloadAll = require('./Controller/DownloadAll');
const AllResume = require('./Controller/allResume');
const conn = require('./Connections/Database');
const cors = require('cors')
const dotenv = require('dotenv')

const app = express();
dotenv.config()
app.use(express.json());
const corsOptions = {
    origin: '*',
    credentials:true
}
app.use(cors(corsOptions))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

app.post('/login', Login);
app.post('/signup', Signup);
app.post('/upload', upload);
app.post('/download', Download);
app.get('/downloads/:filename', DownloadAll);
app.get('/allresume', AllResume);
app.post('/username',Username)
