var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/CategoryController');
var checkAuth = require('../middleware/checkAuth');

router.get('/', categoryController.all_categories);
router.get('/category/:id', categoryController.one_category);
router.post('/category/add', checkAuth, categoryController.add_category);
router.post('/category/update/:id', checkAuth, categoryController.update_category);
router.post('/category/delete/:id', checkAuth, categoryController.delete_category);

module.exports = router;
