var Person = require('../models/Person');

module.exports.all_persons = function(req, res, next) {
    Person.find()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_person = function(req, res, next) {
    var id = req.params.id;
    Person.findById(id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.update_person = function(req, res, next) {
    var id = req.params.id;

    var item = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        social_security_number: req.body.social_security_number,
        address: req.body.address,
        postal_code: req.body.postal_code,
        phone_home: req.body.phone_home,
        phone_mobile: req.body.phone_mobile,
        email: req.body.email
    };

    Person.updateOne({_id : id}, {$set: item})
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