const model = require('../model/payment');

class Payment {
    async addPayment(req, res){
        try {
            const data = await model.create(req.body)
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No category found'
                })

            }
            return res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error
            })
        }
    }

    async getPayment(req, res){
        try {
            const data = await model.find({ isHidden: 0 })
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No category found'
                })

            }
            return res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error
            })
        }
    }

    async updatePayment(){
        try {
            const data = await model.findByIdAndUpdate(req.params.id ,req.body, {new: true})
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No category found'
                })

            }
            return res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error
            })
        }
    }
    async removePayment(){
        try {
            const data = await model.findByIdAndUpdate(req.params.id ,{$set: {isHidden: 1}}, {new: true})
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No category found'
                })

            }
            return res.status(200).json({
                success: true,
                data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error
            })
        }
    }

}

module.exports = new Payment