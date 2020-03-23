var express = require('express');
var authRouter = require('./authRouter');
var productRouter = require('./productRouter');
var brandRouter = require('./brandRouter');
var authService = require('../services/authServices');
var productController = require('../controllers/productController');
//controllers

module.exports = function (app) {

  app.use("/api/product/load", productController.dataLoadForm);
  app.use("/api/allproduct/:brand", productController.listAllProduct);
  app.use("/api/allproduct", productController.listAllProduct);
  app.use("/api/purchase", productController.purchase);

  app.use("/api/auth", authRouter);
  app.use("/api/product", [authService.verifyToken], productRouter);
  app.use("/api/brand", brandRouter);



  var api = express.Router();
  api.get('/', function (req, res, next) {
    res.send('home page');
  });
  api.get('/admin', function (req, res, next) {
    res.send('admin');
  });

  return api;

};
