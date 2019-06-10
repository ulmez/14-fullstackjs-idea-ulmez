var mongoose = require('../db');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  authorityGrade: {type: Number, required: true, default: 0}
}, {collection: 'user'});

var User = mongoose.model('User', userSchema);

module.exports = User;