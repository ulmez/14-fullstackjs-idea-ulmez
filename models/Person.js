var mongoose = require('../db');

var Schema = mongoose.Schema;

var personSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  social_security_number: {type: String, required: true},
  address: {type: String, required: true},
  postal_code: {type: Number, required: true},
  phone_home: {type: String, required: true},
  phone_mobile: {type: String, required: false},
  email: {type: String, required: false},
  user_id: {type: String, required: true}
}, {collection: 'person'});

var Person = mongoose.model('Person', personSchema);

module.exports = Person;