
const Voucher = require('../model/voucher');
const Product = require('../model/products');
const mongoose = require('mongoose');
// Middleware xác thực người dùng



const checkDataPayment = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(403).json({ message: 'user not found'})
    }

    const productIds = req.body.products.map(p => p.productId);
    const products = await Product.find({ _id: { $in: productIds }, isHidden : 0 }).populate('sizes.sizeId');

    const productMap = new Map(products.map(product => [product._id.toString(), product]));

    let totalPrice = 0;
    const arrayProducts = []

    
    for (const orderProduct of req.body.products) {
        const product = productMap.get(orderProduct.productId.toString());

        
        if (!product) {
            throw new Error(`Product ${orderProduct.productId} not found`);
        }
       
        
        const sizeInfo = product.sizes.find(size => size.sizeId._id.toString() === orderProduct.sizes.toString() && size.isHidden === 0);
    
        if (!sizeInfo) {
            throw new Error(`Size ${orderProduct.sizes} not found for product ${orderProduct.productId}`);
        }

        const basePrice = product.basePrice;
        const priceAdjustment = sizeInfo.priceAdjustment;
        const quantity = orderProduct.quantity;

        totalPrice += (basePrice + priceAdjustment) * quantity;
        let obj = {
            productId : product._id,
            sizes: sizeInfo.sizeId._id,
            quantity : orderProduct.quantity
            
        }
        arrayProducts.push(obj);
        
    }
    
    
    let totalPriceBeforeVoucher = totalPrice;
    let totalPriceAfterVoucher;
    let voucher;
    if (req.body.code) {
       
         
        const vouchers = await Voucher.findOne({code: req.body.code})
        const currentDate = new Date()
   
        if (vouchers) {
            voucher = vouchers
            const targetDate = new Date(`${vouchers.expirationDate}`); 
            if (totalPrice >= vouchers.minOrderValue && currentDate <= targetDate && !vouchers.isDelete) {
                if (vouchers.discountType === 'percentage') {
                    const pre = (totalPrice * vouchers.discountValue / 100)
                    totalPriceAfterVoucher = (totalPrice) - pre;
                    if (vouchers.maxDiscount && pre > vouchers.maxDiscount) {
                        totalPriceAfterVoucher = totalPrice - vouchers.maxDiscount;
                    }
                }  
                else{
                    if (vouchers.discountType === 'fixed') {
                        totalPriceAfterVoucher = totalPrice - vouchers.discountValue
                    }
                }
            }
            else{
                totalPriceAfterVoucher = totalPrice
            }
        }
        else{
            totalPriceAfterVoucher = totalPrice
        }
    } 
    else{
        totalPriceAfterVoucher = totalPrice
    }
    const data = {
        userId : new mongoose.Types.ObjectId(`${user.id}`),
        products: arrayProducts,
        voucher: voucher._id || null,
        totalPriceBeforeVoucher,
        totalPriceAfterVoucher,
        paymethod : req.body.paymethod,
        shippingAddress : req.body.shippingAddress
        
    }
    res.locals.dataOrders = data
    next();
    

  
    
    
    
   
}
module.exports = checkDataPayment
