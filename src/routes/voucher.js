const express = require('express');
const voucherRoutes = express.Router()
const voucherController = require('../controller/voucherController')

voucherRoutes.get('/:code', voucherController.getOneVoucherByCode)
voucherRoutes.post('/', voucherController.addVoucher)
voucherRoutes.patch('/:id', voucherController.updateVoucher)
voucherRoutes.delete('/:id', voucherController.deleteVoucherById)
module.exports = voucherRoutes;