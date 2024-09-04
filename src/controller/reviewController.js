const model = require('../model/reviews');
const mongoose = require('mongoose');

class Reviews {
    async getReviewsByUser(req, res) {
        try {
            const productId = req.params.id;
            const data = await model.find({ productId: new mongoose.Types.ObjectId(productId) })
                .populate({
                    path: 'userId',
                    select: 'email'
                });

            if (!data || data.length === 0) {
                return res.status(404).json({ message: 'data not found' });
            }

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }

    async addReview(req, res) {
        try {
            const { productId, userId } = req.body;
            if (!userId || !productId) {
                return res.status(400).json({ success: false, message: 'userId or productId not exists' });
            }

            const inputData = {
                userId: new mongoose.Types.ObjectId(userId),
                productId: new mongoose.Types.ObjectId(productId),
                rating: req.body.rating,
                comment: req.body.comment,
            };

            const checkReviewExists = await model.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                productId: new mongoose.Types.ObjectId(productId)
            });

            if (checkReviewExists) {
                return res.status(400).json({ success: false, message: 'review already exists' });
            }

            const data = await model.create(inputData);
            const populatedData = await model.findById(data._id.toString()).populate({
                path: 'userId',
                select: 'email'
            });

            return res.status(200).json({ success: true, data: populatedData });
        } catch (error) {
            console.log(error);
            
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const idReview = req.params.id;
            const userId = req.body.userId;
            const updateData = req.body;

            const checkReviewExists = await model.findById(idReview);

            if (!checkReviewExists) {
                return res.status(404).json({ success: false, message: 'review not found' });
            }

            if (!checkReviewExists.userId.equals(new mongoose.Types.ObjectId(userId))) {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this review' });
            }

            const data = await model.findByIdAndUpdate(idReview, updateData, { new: true })
                .populate({
                    path: 'userId',
                    select: 'email'
                });

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const idReview = req.params.id;
            const userId = req.body.userId;

            const checkReviewExists = await model.findById(idReview);

            if (!checkReviewExists) {
                return res.status(404).json({ success: false, message: 'review not found' });
            }

            if (!checkReviewExists.userId.equals(new mongoose.Types.ObjectId(userId))) {
                return res.status(403).json({ success: false, message: 'You are not authorized to delete this review' });
            }

            await model.findByIdAndDelete(idReview);

            return res.status(200).json({ success: true, message: 'Review deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
}

module.exports = new Reviews();
