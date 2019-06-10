var express = require('express');
var router = express.Router();
var scoreController = require('../controllers/ScoreController');
var checkAuth = require('../middleware/checkAuth');

router.get('/', scoreController.all_scores);
router.get('/score/:id', scoreController.one_score);
router.post('/score/add', checkAuth, scoreController.add_score);
router.post('/score/update/:id', checkAuth, scoreController.update_score);
router.post('/score/delete/:id', checkAuth, scoreController.delete_score);
router.get('/score/average/all', scoreController.average_all_products_score);
router.get('/score/average/all/:limit/:page', scoreController.average_products_score_limit);
router.get('/score/average/:id', scoreController.average_product_score);
router.get('/score/average/search/id/:category_id', scoreController.average_products_score_search_category);
router.get('/score/average/search/id/:category_id/:limit/:page', scoreController.average_products_score_search_category_limit);
router.get('/score/average/search/name/:product_name', scoreController.average_products_score_search_product_name);
router.get('/score/average/search/name/:product_name/:limit/:page', scoreController.average_products_score_search_product_name_limit);
router.get('/score/average/search/idname/:category_id/:product_name', scoreController.average_products_score_search_category_product_name);
router.get('/score/average/search/idname/:category_id/:product_name/:limit/:page', scoreController.average_products_score_search_category_product_name_limit);

module.exports = router;
