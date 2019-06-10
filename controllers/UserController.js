var jwt = require('jsonwebtoken');
var jwtBlacklist = require('jwt-blacklist')(jwt);
var bcrypt = require('bcrypt');

var User = require('../models/User');
var Person = require('../models/Person');
var Product = require('../models/Product');
var task = require('../helpers/transaction').fawnTask();

module.exports.all_users = function(req, res, next) {
    User.find()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_user = function(req, res, next) {
    var id = req.params.id;
    User.findById(id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_user_on_username = function(req, res, next) {
    var username = req.body.username;
    User.find({
        username: username
    })
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.register_user = function(req, res, next) {
    User.find({
        username: req.body.username
    })
    .exec()
    .then((user) => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Username exists already'
            });
        } else if(req.body.password.length < 6) {
            return res.status(409).json({
                message: 'Password must have at least 6 characters'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    var itemUser = {
                        username: req.body.username,
                        password: hash
                    };
                
                    var itemPerson = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        social_security_number: req.body.social_security_number,
                        address: req.body.address,
                        postal_code: req.body.postal_code,
                        phone_home: req.body.phone_home,
                        phone_mobile: req.body.phone_mobile,
                        email: req.body.email,
                        user_id: {$ojFuture: "0._id"}
                    };
                
                    task
                    .save(User, itemUser)
                    .save(Person, itemPerson)
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
            });
        }
    });
}

module.exports.login_user = (req, res, next) => {
    User.find({
        username: req.body.username
    })
    .select('+password')
    .exec()
    .then((users) => {
        if(users.length < 1) {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }
            
            if(result) {
                const token = jwtBlacklist.sign({
                    username: users[0].username,
                    userId: users[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                
                return res.status(200).json({
                    message: 'Authorization successful',
                    token: token
                });
            }

            res.status(401).json({
                message: 'Authorization failed'
            });
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

module.exports.update_user = function(req, res, next) {
    var id = req.params.id;

    if(req.body.password.length < 6) {
        return res.status(409).json({
            message: 'Password must have at least 6 characters'
        });
    } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                var item = {
                    username: req.body.username,
                    password: hash
                };
            
                User.updateOne({_id : id}, {$set: item})
                .exec()
                .then(function(result) {
                    res.json({
                        message: result
                    });
                })
                .catch(function(err) {
                    res.json({
                        message: {
                            errorCode: err.code,
                            errorMessage: err.errmsg
                        }
                    });
                });
            }
        });
    }
}

module.exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwtBlacklist.verify(token, process.env.JWT_KEY);
        
        res.status(200).json(decoded);
    } catch(err) {
        res.status(401).json({
            message: 'Authorization failed'
        });
    }
}

module.exports.logout_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        jwtBlacklist.blacklist(token);
        
        res.status(200).json({
            message: 'Token blacklisted'
        });
    } catch(err) {
        res.status(401).json({
            message: 'Authorization failed'
        });
    }
};

module.exports.delete_user = function(req, res, next) {
    var id = req.params.id;

    task
    .update(Product, {}, {$pull: {scores: {user_id: id}}})
    .options({ multi: true })
    .remove(Person, {user_id: id})
    .remove(User, {_id: id})
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