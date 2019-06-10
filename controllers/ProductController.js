var Product = require('../models/Product');
var task = require('../helpers/transaction').fawnTask();
var upload = require('../helpers/upload').getUpload();
var cloudinary = require('../helpers/upload').getCloudinary();

var cloudinaryFolder = process.env.CLOUDINARY_FOLDER;

module.exports.all_products = function(req, res, next) {
    Product.find()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.one_product = function(req, res, next) {
    var id = req.params.id;
    Product.findById(id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({
                message: err
            });
        });
}

module.exports.add_product = function(req, res, next) {
    Product.find({
        name: req.body.name
    })
    .exec()
    .then((prod) => {
        if(prod.length >= 1) {
            return res.status(409).json({
                message: 'Product name exists already'
            });
        } else {
            var item = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                categories: JSON.parse(req.body.categories)
            };
        
            task
            .save(Product, item)
            .run({useMongoose: true})
            .then(function(results) {
                if(req.files.image) {
                    var imagePath = req.files.image.path;
                    
                    upload(req, res, function(err) {
                        if(err) {
                            return res.json({
                                message: err
                            });
                        }
        
                        cloudinary.v2.uploader.upload(imagePath, {
                            folder: cloudinaryFolder,
                            public_id: results[0]._id,
                            allowed_formats: ['jpg', 'png']
                        }, function(error, result) {
                            if(error) {
                                return res.json({
                                    message: error
                                });
                            }
                        });
                    });
                }
        
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
    })
    .catch((error2) => {
        res.json({
            message: error2
        });
    });
}

module.exports.update_product = function(req, res, next) {
    var id = req.params.id;

    var item = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        categories: JSON.parse(req.body.categories)
    };

    Product.updateOne({_id : id}, {$set: item})
    .exec()
    .then(function(result) {
        if(req.files.image) {
            var imagePath = req.files.image.path;
            
            upload(req, res, function(err) {
                if(err) {
                    return res.json({
                        message: err
                    });
                }

                cloudinary.v2.uploader.upload(imagePath, {
                    folder: cloudinaryFolder,
                    public_id: id,
                    allowed_formats: ['jpg', 'png']
                }, function(error, result) {
                    if(error) {
                        return res.json({
                            message: error
                        });
                    }
                });
            });
        }

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

module.exports.delete_product = function(req, res, next) {
    var id = req.params.id;

    Product.deleteOne({"_id" : id})
    .exec()
    .then(function(results) {
        cloudinary.v2.uploader.destroy(`${cloudinaryFolder}/${id}`, function(error, result) {
            if(error) {
                return res.json({
                    message: error
                });
            }
        });

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