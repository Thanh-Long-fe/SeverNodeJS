const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho User
const userSchema = new Schema({
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nên mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
  name: { type: String }, // Tên người dùng
  phoneNumber: { type: String },
  address: { type: String }, // Địa chỉ của người dùng dưới dạng chuỗi
  profilePicture: { type: String }, // URL đến hình ảnh hồ sơ người dùng
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Quyền hạn của người dùng
  isActive: { type: Boolean, default: true }, // Trạng thái hoạt động của tài khoản
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo model User từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
