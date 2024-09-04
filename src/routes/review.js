const express = require('express');
const reviewRoutes = express.Router()
const reviewController = require('../controller/reviewController');
reviewRoutes.get('/:id', reviewController.getReviewsByUser)
reviewRoutes.post('/', reviewController.addReview)
reviewRoutes.patch('/:id', reviewController.updateReview)
reviewRoutes.delete('/:id', reviewController.deleteReview)

module.exports = reviewRoutes