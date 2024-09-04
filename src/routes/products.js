const express = require('express');
const productsRoute = express.Router()
const productsController = require('../controller/productsController');
const upload = require('../ultil/multer')

productsRoute.post('/',upload.single('imageURL'), productsController.addProducts)
productsRoute.patch('/:id',upload.single('imageURL'),productsController.updateProducts)
productsRoute.delete('/:id',productsController.removeProducts)


productsRoute.get('/top',productsController.getTopFeaturedProducts)

productsRoute.get('/:id',productsController.getProductsWithDetails)

productsRoute.get('/',productsController.getProducts)
module.exports = productsRoute