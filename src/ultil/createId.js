const crypto = require('crypto');
const generateOrderId = () => {
    return 'ORDER-' + new Date().getTime() + '-' + crypto.randomBytes(8).toString('hex');
}

module.exports = generateOrderId