var multer = require('multer');
var storage = multer.memoryStorage();

var upload = multer({storage: storage}).single('image');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.getUpload = function() {
    return upload;
}

module.exports.getCloudinary = function() {
    return cloudinary;
}