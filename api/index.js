"use strict";
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//require library
var express = require('express');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var cors = require('cors');
const multer = require('multer');
var path = require('path');


//require local files
var indexRouter = require('./routes/indexRouter');

// Initializations
const app = express();
require('./database/database')

//Environment variables

// Setting
const port = process.env.PORT || 3031;
const host = process.env.HOST || '0.0.0.0';

// Middlewares
app.use(morgan('dev'));
app.use(cors())
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename(req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})
app.use(multer({ storage }).single('image'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routers
app.use(express.static(path.join(__dirname, 'build')));


app.use("/api", indexRouter(app));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Static files
app.use(express.static(path.join(__dirname, 'public')));


// Create document folders if dont exists
const docsDir = __dirname + "/documents";


app.listen(port, () => {
    console.log(`API REST running in http://localhost:${port}`)
})
