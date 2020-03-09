var express = require('express');
var authRouter = require('./authRouter');
//controllers

module.exports = function (app) {

  app.use("/api/auth", authRouter);

  var api = express.Router();
  api.get('/', function (req, res, next) {
    res.send('home page');
  });
  api.get('/admin', function (req, res, next) {
    res.send('admin');
  });

  return api;

};
