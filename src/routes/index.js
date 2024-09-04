const productsRoutes = require('./products')
const cartRoutes = require('./cart')
const reviewRoutes = require('./review')
const orderRoutes = require('./order') 
const patmentAPI = require('./paymentAPI') 
const userRoutes = require('./user') 
const voucherRoutes = require('./voucher') 
module.exports = function (app){
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/pay', patmentAPI)
app.use('/api/voucher', voucherRoutes)
app.use('/api', userRoutes)
}