// Everything here is served under /api.
const router = require('express').Router();

router.use('/health', require('./health.routes'));
router.use('/enquiries', require('./enquiry.routes'));
router.use('/wedding-enquiries', require('./weddingEnquiry.routes'));
router.use('/subscribers', require('./subscriber.routes'));
router.use('/shop', require('./shop.routes'));

module.exports = router;
