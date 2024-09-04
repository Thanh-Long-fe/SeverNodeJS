const model = require('../model/categories')

class Category {

    async getAllCategory(req, res){
        try {
            const data = await model.find({ isHidden: 0 });
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
    } async getOneCategory(req, res){
        try {
            const data = await model.findById(req.params.id);
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
    async addCategory(req, res){
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

    async updateCategory(req, res){
        try {
            const data = await model.findByIdAndUpdate(req.params.id, req.body, {new: true})
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
    async removeCategory(req, res){
        try {
            const data = await model.findByIdAndUpdate(req.params.id, {$set : {isHidden : 1}}, {new: true})
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
    async unHiddenCategory(req, res){
        try {
            const data = await model.findByIdAndUpdate(req.params.id, {$set : {isHidden : 0}}, {new: true})
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

module.exports = new Category