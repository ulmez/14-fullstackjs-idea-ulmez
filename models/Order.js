var mongoose = require('../db');

var Schema = mongoose.Schema;

var orderSchema = new Schema({
  date: {type: Date, required: true},
  user_id: {type: String, required: true},
  products: {type: Array, required: true}
}, {collection: 'order'});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;