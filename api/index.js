"use strict";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/indexRouter');
var path = require('path');

// Initializations
const app = express();
require('./database/database')

//Environment variables

// Setting
const port = process.env.PORT || 3031;
const host = process.env.HOST || '0.0.0.0';

// Middlewares
app.use(logger('dev'));
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());



// Routers
app.use("/api", indexRouter(app));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Create document folders if dont exists
const docsDir = __dirname + "/documents";
// --------------------------------------

app.listen(port, () => {
    console.log(`API REST running in http://localhost:${port}`)
})
