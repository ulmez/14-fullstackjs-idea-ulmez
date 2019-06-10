var mongoose = require('../db');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: {type: String, required: true}
}, {collection: 'category'});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;