const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Products = require('./products')
const Users = require('./users')
// Định nghĩa Schema cho Cart
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến người dùng
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến sản phẩm
      size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
      priceTotal: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 } // Số lượng sản phẩm trong giỏ hàng
    }
  ],
  createdAt: { type: Date, default: Date.now }, // Ngày tạo giỏ hàng
  updatedAt: { type: Date, default: Date.now } // Ngày cập nhật giỏ hàng
});

// Tạo model Cart từ schema
const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;