const mongoose = require('mongoose');
const User = require('./users');
const Voucher = require('./voucher');
const Payment = require('./payment');
const Size = require('./size');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId :{ type: String, required: true, unique: true},
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    sizes: { type: Schema.Types.ObjectId, ref: 'Size' },
    quantity: { type: Number, required: true }
  }],
  voucher: { type: Schema.Types.ObjectId, ref: 'Voucher'},
  totalPriceBeforeVoucher: { type: Number, required: true },
  totalPriceAfterVoucher: { type: Number, required: true },
  paymethod: { type: Schema.Types.ObjectId, ref: 'Payment', required: true }, // Tham chiếu đến bảng Payment
  shippingAddress: { type: String, required: true },

  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
