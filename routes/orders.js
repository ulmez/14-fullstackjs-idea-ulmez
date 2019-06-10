var express = require('express');
var router = express.Router();
var orderController = require('../controllers/OrderController');
var checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, orderController.all_orders);
router.get('/order/:id', checkAuth, orderController.one_order);
router.get('/order/user/:id', checkAuth, orderController.orders_on_user);
router.post('/order/add', checkAuth, orderController.add_order);
router.post('/order/update/:id', checkAuth, orderController.update_order);
router.post('/order/delete/:id', checkAuth, orderController.delete_order);

module.exports = router;
