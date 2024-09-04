const model = require('../model/voucher');
const mongoose = require('mongoose');

class Voucher {
async getOneVoucherByCode(req, res){
const data = await model.findOne({ code: req.params.code})

if (!data){
    return res.status(404).json({
        message: 'voucher not found'
    })
}

return res.status(200).json({
   data
})
}

async addVoucher(req, res){
    const codeExists = await model.findOne({ code: req.body.code})
    if (codeExists) {
        return res.status(400).json({
            message: 'code already exists'
        })
    }
    const data = await model.create(req.body)

    if (!data){
        return res.status(404).json({
            message: 'voucher not found'
        })
    }
    
    return res.status(200).json({
       data
    })
} 

async updateVoucher(req, res){
   
    const data = await model.findByIdAndUpdate(req.params.id, req.body)

    if (!data){
        return res.status(404).json({
            message: 'voucher not found'
        })
    }
    
    return res.status(200).json({
       data
    })
} 

async deleteVoucherById(req, res){ 
   
    const data = await model.findByIdAndUpdate(req.params.id, {$set : {isDelete : true}})

    if (!data){
        return res.status(404).json({
            message: 'voucher not found'
        })
    }
    
    return res.status(200).json({
       data
    })
} 


}

module.exports = new Voucher;
