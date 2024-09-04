const jwt = require('jsonwebtoken');
const SECRET_KEY = 'LongYeuPhuong' 
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token,SECRET_KEY , (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log(123);
        
        next();
    });
};

module.exports = authenticateToken