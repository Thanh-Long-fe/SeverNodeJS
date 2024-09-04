const express = require('express');
const orderRoutes = express.Router()
const orderController = require('../controller/orderController');

orderRoutes.get('/:id', orderController.getListOrderByUser)




module.exports = orderRoutes