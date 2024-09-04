const express = require('express');
const userRoutes = express.Router()
const userController = require('../controller/usersController');


userRoutes.post('/login',userController.login)
userRoutes.post('/register',userController.register)



module.exports = userRoutes