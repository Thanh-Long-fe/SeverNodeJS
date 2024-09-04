const express = require('express');
const categoryRoutes = express.Router()
const categoryController = require('../controller/categoryController');


categoryRoutes.get('/', categoryController.getAllCategory)
categoryRoutes.get('/:id', categoryController.getOneCategory)

categoryRoutes.post('/', categoryController.addCategory)
categoryRoutes.patch('/:id', categoryController.updateCategory)
categoryRoutes.patch('/:id/unHidden', categoryController.unHiddenCategory)
categoryRoutes.delete('/:id', categoryController.removeCategory)


module.exports = categoryRoutes