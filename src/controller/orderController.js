const model = require('../model/orders')
const mongoose = require('mongoose');

class Order {

    async getListOrderByUser(req, res){
    try {
        const data = await model.find({userId : new mongoose.Types.ObjectId(`${req.params.id}`)})
        .populate({
            path: 'userId',
            select: 'email name'
        })
        .populate({
            path: 'products.sizes', // Sửa lại đường dẫn chính xác đến sizes
            select: 'size'
        })
        .populate({
            path: 'products.productId',
            select: 'name basePrice imageURL'

        })
        .populate({
            path: 'voucher',
            select: 'code discountType minOrderValue'

        })
        .populate({
            path: 'paymethod',
            select: 'method'

        })
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'orders not found'
            })
        }
        return res.status(200).json({
            success: true,
          data
        })
    } catch (error) {
        console.log(error);
        
    }


    }
    
}

module.exports = new Order


