const mongoose = require('mongoose');
const Users = require('./users');
const Products = require('./products');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Review
const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến người dùng
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến sản phẩm
  rating: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1 đến 5
  comment: { type: String }, // Bình luận của người dùng về sản phẩm
  createdAt: { type: Date, default: Date.now }, // Ngày tạo đánh giá
  updatedAt: { type: Date, default: Date.now } // Ngày cập nhật đánh giá
});

// Tạo model Review từ schema
const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
