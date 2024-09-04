
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.sendStatus(401); // Chưa xác thực
        }
        
        if (req.user.role !== requiredRole) {
            return res.sendStatus(403); // Không có quyền truy cập
        }
        
        next(); // Người dùng có quyền truy cập
    };
};

module.exports = checkRole;