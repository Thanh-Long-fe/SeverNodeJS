const express = require('express');
const cartRoute = express.Router()
const cartController = require('../controller/cartController');


cartRoute.post('/:id',cartController.addProductCart)
cartRoute.patch('/:id',cartController.updateQuantity)
cartRoute.delete('/:id',cartController.removeProductsCart)



cartRoute.get('/:id',cartController.getOneCartByIdUser)
module.exports = cartRoute