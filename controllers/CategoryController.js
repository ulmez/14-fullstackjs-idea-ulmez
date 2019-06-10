var Category = require('../models/Category');
var Product = require('../models/Product');
var task = require('../helpers/transaction').fawnTask();

module.exports.all_categories = function(req, res, next) {
    Category.find()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_category = function(req, res, next) {
    var id = req.params.id;
    Category.findById(id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.add_category = function(req, res, next) {
    var item = {
        name: req.body.name
    };

    task
    .save(Category, item)
    .run({useMongoose: true})
    .then(function(results){
        res.json({
            message: results
        });
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.update_category = function(req, res, next) {
    var id = req.params.id;

    var item = {
        name: req.body.name
    };

    Category.updateOne({_id : id}, {$set: item})
    .exec()
    .then(function(result) {
        res.json({
            message: result
        });
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.delete_category = function(req, res, next) {
    var id = req.params.id;

    task
    .update(Product, {}, {$pull: {categories: {category_id: id}}})
    .options({ multi: true })
    .remove(Category, {_id: id})
    .run({useMongoose: true})
    .then(function(results){
        res.json({
            message: results
        });
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}