const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true }, // Mã voucher
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // Loại giảm giá (phần trăm hoặc số tiền cố định)
  discountValue: { type: Number, required: true }, // Giá trị giảm giá
  minOrderValue: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu để áp dụng voucher
  maxDiscount: { type: Number }, // Giảm giá tối đa (áp dụng cho voucher loại phần trăm)
  expirationDate: { type: Date, required: true }, // Ngày hết hạn của voucher
  createdAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: true, required: true}
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
