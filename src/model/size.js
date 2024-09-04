const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho Size
const sizeSchema = new Schema({
    
  size: { type: String, required: true },
  isHidden: { type: Number, required: true },
  
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size
