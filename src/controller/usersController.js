const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const model = require('../model/users');
const dotenv = require('dotenv')

dotenv.config();
const SECRET_KEY = 'LongYeuPhuong' 


class Users {
        async addUserAdmin(req, res, next) {
            const email = req.body.email;
            const userExists = await model.findOne({ email: email });
            if (userExists) {
                return res.status(403).json({
                    success: false,
                    message: 'User already exists'
                })
            }
            const hassPassword = bcrypt.hashSync(req.body.password, 10);
            if (!hassPassword) {
                return res.status(403).json({
                    success: false,
                    message: 'Password hass failed'
                })
            }
            req.body.role = 'admin'
            const user = await model.create(req.body);
            return res.status(200).json({
                success: true,
                data: user
            })
        }

        async register(req, res, next) {
            const email = req.body.email;
            const userExists = await model.findOne({ email: email });
            if (userExists) {
                return res.status(403).json({
                    success: false,
                    message: 'User already exists'
                })
            }
            const hassPassword = bcrypt.hashSync(req.body.password, 10);
            if (!hassPassword) {
                return res.status(403).json({
                    success: false,
                    message: 'Password hass failed'
                })
            }
            req.body.password = hassPassword
            req.body.role = 'user'
            const user = await model.create(req.body);
            return res.status(200).json({
                success: true,
                data: user
            })
        }

        
        async login(req, res, next) {
            try {
                const email = req.body.email;
                const user = await model.findOne({ email: email }); // Sử dụng await để đợi kết quả truy vấn
        
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
        
                const checkPassword = bcrypt.compareSync(req.body.password, user.password);
                if (!checkPassword) {
                    return res.status(401).json({
                        success: false,
                        message: 'Password error'
                    });
                }
              
               
            
                
                const token = jwt.sign(
                    { email: email, id: user._id },
                    SECRET_KEY,
                    { expiresIn: '1d' }
                );
        
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token error'
                    });
                }
        
                user.password = undefined; // Xóa bỏ trường password trước khi trả về client
        
                return res.status(200).json({
                    success: true,
                    data: user,
                    accessToken: token
                });
            } catch (error) {
                next(error); // Truyền lỗi cho middleware xử lý lỗi tiếp theo
            }
        }
        async showProfile(req, res) {
            const data = await model.findById(req.params.id);
            data.password = undefined;
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                })
            }
            
            return res.status(200).json({
                success: true,
                data 
            })
        }
}
module.exports = new Users