var Order = require('../models/Order');
var task = require('../helpers/transaction').fawnTask();

module.exports.all_orders = function(req, res, next) {
    Order.find()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_order = function(req, res, next) {
    var id = req.params.id;

    Order.findById(id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.orders_on_user = function(req, res, next) {
    var userId = req.params.id;

    Order.find({user_id: userId}).sort('-date')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.add_order = function(req, res, next) {
    var item = {
        date: Date.now(),
        user_id: req.body.user_id,
        products: req.body.products
    };

    task
    .save(Order, item)
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

module.exports.update_order = function(req, res, next) {
    var id = req.params.id;

    var item = {
        date: Date.now(),
        products: req.body.products
    };

    Order.updateOne({_id : id}, {$set: item})
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

module.exports.delete_order = function(req, res, next) {
    var id = req.params.id;

    task
    .remove(Order, {_id: id})
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