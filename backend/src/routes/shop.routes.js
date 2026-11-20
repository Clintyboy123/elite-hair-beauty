const router = require('express').Router();
const { param } = require('express-validator');
const validate = require('../middleware/validate');
const controller = require('../controllers/shop.controller');

router.get('/products', controller.list);
router.get('/products/:id', validate([param('id').isInt({ min: 1 }).withMessage('Unknown product').toInt()]), controller.detail);

module.exports = router;
