const mongoose = require('mongoose');
async function connect() {
    mongoose.connect('mongodb://localhost:27017/TeaMilk')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
}
module.exports = {connect}