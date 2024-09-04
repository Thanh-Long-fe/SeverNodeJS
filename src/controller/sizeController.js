const model = require('../model/size');

class Size {

   async getSize(req, res) {
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


    }

    async addSize(req, res) {
        const data = await model.create(req.body);
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
    
        
    }
    async updateSize(req, res) {
        const data = await model.findByIdAndUpdate(req.params.id ,req.body, {new: true});
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
    
        
    }

    async removeSize(req, res) {
        const data = await model.findByIdAndUpdate(req.params.id ,{$set : {isHidden: 1}}, {new: true});
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
    
        
    }

}
module.exports = new Size