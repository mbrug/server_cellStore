var express = require('express');

module.exports = (function () {

  var api = express.Router();
  const authController = require('../controllers/authController');
  const authService = require('../services/authServices');

  api.post('/register', [authService.checkDuplicateUserNameOrEmail, authService.checkRoleExisted], authController.register);
  api.post('/login', authController.login);
  api.post('/confirmAccount', authController.confirmAccount);

  return api;

})();
