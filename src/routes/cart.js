const express = require('express');
const cartRoute = express.Router()
const cartController = require('../controller/cartController');
const checkRole = require('../middleware/checkRole');
const checkUser = require('../middleware/checkUser');

cartRoute.post('/:id',cartController.addProductCart)
cartRoute.patch('/:id',cartController.updateQuantity)
cartRoute.delete('/:id',cartController.removeProductsCart)



cartRoute.get('/:id',cartController.getOneCartByIdUser)
module.exports = cartRoute