var express = require('express');

module.exports = (function () {

  var authRoutes = express.Router();
  const authController = require('../controllers/authController');
  const authService = require('../services/authServices');

  authRoutes.get('/users', [authService.verifyToken], authController.listUsers);


  authRoutes.post('/register', [authService.checkDuplicateUserNameOrEmail], authController.register);
  authRoutes.post('/login', authController.login);
  authRoutes.post('/confirmAccount', authController.confirmAccount);
  authRoutes.post('/refresh', authController.refreshToken);

  return authRoutes;

})();
