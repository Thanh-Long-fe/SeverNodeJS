const crypto = require('crypto');
const axios = require('axios');
const Order = require('../model/orders');
const Pay = require('../model/payment');
const mongoose = require('mongoose');


const generateOrderId = require('../ultil/createId')


var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

class ProcessPayment {
    

    async payment(req, res) {
        const dataOrders = res.locals.dataOrders;
      // Lưu dataOrders vào global
     

   
        
        if (!dataOrders){
            return res.status(404).json({message: 'dataOrders not found'})
        }
       const methodPay = await Pay.findById(new mongoose.Types.ObjectId(`${dataOrders.paymethod}`))
       if (!methodPay || dataOrders.paymethod.toString() !== '66cf2db31fc63f20724b16de') {
            return res.status(404).json({message: 'paymethod not found'})
       }
   
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
      
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        var ipnUrl = 'https://3bdb-14-191-23-220.ngrok-free.app/api/pay/callback';
        var requestType = "payWithMethod";
        var amount = `${dataOrders.totalPriceAfterVoucher}`;
        var orderId = partnerCode + "-" + generateOrderId();
        var requestId = orderId;
        var extraData = '';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
       
        //signature

        dataOrders.orderId = orderId
        dataOrders.paymethod = new mongoose.Types.ObjectId('66cf2db31fc63f20724b16de')
        global.tempDataOrders = dataOrders
        
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
    

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
           
        });

       const options = {
        method : 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody 
       }
       let result;
       try {
        result = await axios(options)
        return res.status(200).json(result.data)
       } catch (error) {
        console.error(error)
       }
    }
    async checkPay(req, res) {
        const { orderId, resultCode} = req.body;
        const dataOrders = global.tempDataOrders;
        console.log('DataOrders từ bộ nhớ tạm:', dataOrders);
        
       
       
     
      
        
        if (resultCode === 0) {
            // Gọi API transaction_payment để xác minh giao dịch từ MoMo
            try {
                const  rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
                const signature = crypto
                    .createHmac("sha256", secretKey)
                    .update(rawSignature)
                    .digest("hex");
    
                const requestBody = JSON.stringify({
                    partnerCode: 'MOMO',
                    requestId: orderId,
                    orderId: orderId,
                    signature: signature,
                    lang: 'vi'
                });
    
                const options = {
                    method : 'POST',
                    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: requestBody 
                };
    
                let result = await axios(options);
    
                // Kiểm tra kết quả từ MoMo
                if (result.data.resultCode === 0) {
                    
                   const data = await Order.create(dataOrders)
                   orderId = dataOrders.orderId;
                    
                   return res.status(200).json({ message: 'Order created successfully', orderId, data });
                } else {
                    // Giao dịch không hợp lệ
                    console.log(`Giao dịch không hợp lệ hoặc không thành công: ${orderId}`);
                    return  res.status(400).json({ message: 'Invalid transaction', orderId });
                }
            } catch (error) {
                console.error('Lỗi khi xác minh giao dịch:', error);
                return res.status(500).json({ message: 'Error verifying transaction', error });
            }
        } else {
            // Giao dịch thất bại
            console.log(`Giao dịch thất bại: ${orderId}`);
            res.status(400).json({ message: 'Transaction failed', orderId });
        }
    }
    
    async transaction_payment(req, res){
        const orderId = req.params.order
      if (!orderId) {
        return res.status(400).json({ message: 'OrderId is not available' });
    
      }

      const data = await Order.findOne({ orderId: orderId}) .populate({
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

    if (!data && req.user.id.toString() !== data?.userId?.toString()) {
        return res.status(404).json({
            success: false,
            message: 'orders not found'
        })
    }
    return res.status(200).json({
        success: true,
        data
    })
    }


}

module.exports = new ProcessPayment