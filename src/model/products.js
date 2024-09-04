const mongoose = require('mongoose');
const Sizes = require('./size')
const Categories = require('./categories')
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Size


// Định nghĩa Schema cho Product
const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    sizes: [{ 
      sizeId: { type: Schema.Types.ObjectId, ref: 'Size' , required: true} ,
      priceAdjustment: { type: Number, required: true },
      isHidden: { type: Number, required: true, default: 0}

    }],
    category: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    imageURL: { type: String },
    stock: { type: Number, default: 0 },
    isFeatured: { type: Number, default: 0 },
    isHidden: { type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    
  });

// Tạo model Product từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
