const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', // Thư mục lưu trữ trên Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Định dạng cho phép
      public_id: (req, file) => {
        // Tạo tên file không trùng lặp
        return 'file_' + uuidv4(); // Ví dụ: file_123e4567-e89b-12d3-a456-426614174000
      },
    },
  });

const upload = multer({ storage: storage });

module.exports = upload;