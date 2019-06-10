var Product = require('../models/Product');

module.exports.all_scores = function(req, res, next) {
    Product.find()
    .select('scores')
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.one_score = function(req, res, next) {
    var id = req.params.id;

    Product.findById(id)
    .select('scores')
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.add_score = function(req, res, next) {
    var score = {
        user_id: req.body.user_id,
        score: req.body.score
    };

    Product.update(
        {
            _id: req.body.id,
            'scores.user_id': {$ne: req.body.user_id}
        },
        {
            $addToSet: {scores: score}
        }
    )
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

module.exports.update_score = function(req, res, next) {
    var id = req.params.id;

    Product.update(
        {
            _id: id,
            'scores.user_id': req.body.user_id
        },
        {
            $set:
            {
                'scores.$.score': req.body.score
            }
        }
    )
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

module.exports.delete_score = function(req, res, next) {
    var id = req.params.id;

    Product.update(
        {
            _id: id
        },
        {
            $pull:
            {
                'scores': {user_id: req.body.user_id}
            }
        }
    )
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

module.exports.average_product_score = function(req, res, next) {
    var id = req.params.id;
    var mongoose = require('mongoose');
    var type = mongoose.Types;

    Product.aggregate([
        {
            $match : {_id : type.ObjectId(id)}
        },
        {
            "$addFields": {
                score_average: {"$avg": "$scores.score"}
            }
        }
    ])
    .exec()
    .then(function(result) {
        res.json({
            message: result[0]
        });
    })
    .catch(function(err) {
        res.json({
            message: err
        });
    });
}

module.exports.average_all_products_score = function(req, res, next) {
    Product.aggregate([
        {"$addFields": {
            "score_average": { "$avg": "$scores.score" }
          }}
    ])
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

module.exports.average_products_score_limit = function(req, res, next) {
    var limit = parseInt(req.params.limit);
    var page = parseInt(req.params.page);

    Product.aggregate([
        {
            $skip : page
        },
        {
            $limit: limit
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_product_name = function(req, res, next) {
    var product_name = req.params.product_name;

    Product.aggregate([
        {
            $match: {
                "name": {$regex: '.*' + product_name + '.*'}
            }
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_product_name_limit = function(req, res, next) {
    var limit = parseInt(req.params.limit);
    var page = parseInt(req.params.page);
    
    var product_name = req.params.product_name;

    Product.aggregate([
        {
            $match: {
                "name": {$regex: '.*' + product_name + '.*'}
            }
        },
        {
            $skip : page
        },
        {
            $limit: limit
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_category_product_name = function(req, res, next) {
    var category_id = req.params.category_id;
    var product_name = req.params.product_name;

    Product.aggregate([
        {
            $match: {
                "categories.category_id": category_id,
                "name": {$regex: '.*' + product_name + '.*'}
            }
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_category_product_name_limit = function(req, res, next) {
    var limit = parseInt(req.params.limit);
    var page = parseInt(req.params.page);
    
    var category_id = req.params.category_id;
    var product_name = req.params.product_name;

    Product.aggregate([
        {
            $match: {
                "categories.category_id": category_id,
                "name": {$regex: '.*' + product_name + '.*'}
            }
        },
        {
            $skip : page
        },
        {
            $limit: limit
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_category = function(req, res, next) {
    var category_id = req.params.category_id;
    console.log(category_id);

    Product.aggregate([
        {
            $match: {
                "categories.category_id": category_id
            }
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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

module.exports.average_products_score_search_category_limit = function(req, res, next) {
    var limit = parseInt(req.params.limit);
    var page = parseInt(req.params.page);
    
    var category_id = req.params.category_id;

    Product.aggregate([
        {
            $match: {
                "categories.category_id": category_id
            }
        },
        {
            $skip : page
        },
        {
            $limit: limit
        },
        {
            "$addFields": {
                "score_average": {"$avg": "$scores.score"}
            }
        },
        {
            $sort: {score_average : -1}
        }
    ])
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