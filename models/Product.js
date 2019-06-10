var mongoose = require('../db');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    scores: {type: Array, required: false},
    categories: {type: Array, required: false}
}, {collection: 'product'});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;