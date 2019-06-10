var express = require('express');
var router = express.Router();
var personController = require('../controllers/PersonController');
var checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, personController.all_persons);
router.get('/person/:id', checkAuth, personController.one_person);
router.post('/person/update/:id', checkAuth, personController.update_person);

module.exports = router;
