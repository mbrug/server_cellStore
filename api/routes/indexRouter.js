var express = require('express');
var authRouter = require('./authRouter');
var productRouter = require('./productRouter');
var authService = require('../services/authServices');
//controllers

module.exports = function (app) {

  app.use("/api/auth", authRouter);
  app.use("/api/product", [authService.verifyToken], productRouter);

  var api = express.Router();
  api.get('/', function (req, res, next) {
    res.send('home page');
  });
  api.get('/admin', function (req, res, next) {
    res.send('admin');
  });

  return api;

};
