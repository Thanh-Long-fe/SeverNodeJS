const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  method: { type: String, required: true }, // Tên phương thức thanh toán (ví dụ: Credit Card, PayPal, v.v.)
  details: { type: String },
  isHidden: { type: Number, required : true, default: 0 }, // Thông tin chi tiết thêm về phương thức thanh toán
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
