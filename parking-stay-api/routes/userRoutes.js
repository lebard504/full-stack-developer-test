/* eslint-disable max-len */

var express = require('express');
const userController = require('../controllers/userController');

var userRouter = express.Router();

const {
  getPermissions
} = userController();

// Public end point for login
userRouter.post('/login', getPermissions);

module.exports = userRouter;
