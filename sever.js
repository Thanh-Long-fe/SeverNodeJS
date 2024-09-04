const express = require('express');
const conn = require('./src/config/db');
const routes = require('./src/routes')
const app = express();
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const cloudinary = require('./src/config/cloudinary')


app.use(session({
  secret: 'long', // Thay đổi thành khóa bí mật của bạn
  resave: false,
  saveUninitialized: false,
 
  cookie: { secure: false } // Đặt true nếu sử dụng HTTPS
}));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

conn.connect()

routes(app)
app.listen(3000,() => {
    console.log('listening on')
}); 

