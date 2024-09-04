const express = require('express');
const paymentRoutes = express.Router()
const paymentController = require('../controller/processPaymentAPI');
const checkUser = require('../middleware/checkUser');
const checkdata = require('../middleware/dataPayment');

paymentRoutes.post('/callback', paymentController.checkPay)
paymentRoutes.post('/',checkUser, checkdata, paymentController.payment)
paymentRoutes.get('/:order',checkUser, paymentController.transaction_payment)

module.exports = paymentRoutes