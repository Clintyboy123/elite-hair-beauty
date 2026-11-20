const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const controller = require('../controllers/subscriber.controller');
const rules = require('./rules');

router.post('/', formLimiter, validate([rules.email(), body('source').optional().isIn(['newsletter']), rules.honeypot()]), controller.create);

module.exports = router;
