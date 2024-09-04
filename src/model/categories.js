const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Tên danh mục, bắt buộc và duy nhất
  description: { type: String }, // Mô tả danh mục
  isHidden: { type: String, required: true, default: 0 }, 
  createdAt: { type: Date, default: Date.now }, // Ngày tạo danh mục
  updatedAt: { type: Date, default: Date.now } // Ngày cập nhật danh mục
});

// Tạo model từ schema
const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;
