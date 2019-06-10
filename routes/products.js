var express = require('express');
var router = express.Router();
var productController = require('../controllers/ProductController');
var checkAuth = require('../middleware/checkAuth');

router.get('/', productController.all_products);
router.get('/product/:id', productController.one_product);
router.post('/product/add', checkAuth, productController.add_product);
router.post('/product/update/:id', checkAuth, productController.update_product);
router.post('/product/delete/:id', checkAuth, productController.delete_product);

module.exports = router;
