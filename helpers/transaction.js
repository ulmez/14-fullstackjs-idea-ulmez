var mongoose = require('../db');
var Fawn = require("fawn");
Fawn.init(mongoose);

module.exports.fawnTask = function() {
    return Fawn.Task();
}