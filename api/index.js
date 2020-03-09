"use strict";
var dotenv = require('dotenv');
dotenv.config();

var express = require('express');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/indexRouter');
var mongoose = require('mongoose');
var path = require('path');

// Initializations
const app = express();

//Environment variables

// Setting
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.SERVER_PORT || 3031

// Middlewares
app.use(logger('dev'));
app.use(cors())

// Routers
app.use("/api", indexRouter(app));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Create document folders if dont exists
const docsDir = __dirname + "/documents";
// --------------------------------------

// Start the Server
// mongoose.connect(process.env.DB_CONNECT, (err, res) => {
//     if(err) throw err
//     console.log('connection established successfully');
//     app.listen(port, () => {
//         console.log(`API REST running in http://localhost:${port}`)
//     })
// })

app.listen(port, () => {
    console.log(`API REST running in http://localhost:${port}`)
})

//mongodb+srv://michael:<M1ch43l.c0m>@cluster0-eeqp8.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
    .then(response => {
        console.log(`Database connected success http://localhost:${port}`);
        // app.listen(port, () => {
        //     console.log(`API REST running in http://localhost:${port}`)
        // })
    })
    .catch(error => {
        console.log('Error Database connection')
    });




// var createError = require('http-errors');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());