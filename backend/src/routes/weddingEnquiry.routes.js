const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const controller = require('../controllers/weddingEnquiry.controller');
const rules = require('./rules');

// Keep in step with frontend/src/content/services.js (weddingServiceOptions)
const SERVICES = ['Bridal hair', 'Wedding make-up', 'Bridal party hair', 'Bridal party make-up', 'Beauty treatments before the day', 'Not sure yet'];

// Today in South Africa, as YYYY-MM-DD.
const todayInSA = () => new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 10);
const inYears = (iso, years) => `${Number(iso.slice(0, 4)) + years}${iso.slice(4)}`;

router.post(
  '/',
  formLimiter,
  validate([
    rules.name(),
    rules.email(),
    rules.phone(),
    body('weddingDate')
      .isISO8601({ strict: true })
      .withMessage('Choose your wedding date')
      .bail()
      .custom((value) => {
        const today = todayInSA();
        if (value < today) throw new Error('Please choose a date from today onwards');
        if (value > inYears(today, 3)) throw new Error('Please choose a date within the next three years');
        return true;
      }),
    body('venue').optional({ values: 'falsy' }).trim().isLength({ max: 200 }).withMessage('Please keep this under 200 characters'),
    body('partySize').optional({ values: 'falsy' }).isInt({ min: 1, max: 40 }).withMessage('Enter a number between 1 and 40').toInt(),
    body('services').isArray({ min: 1, max: SERVICES.length }).withMessage('Choose at least one service (or “Not sure yet”)'),
    body('services.*').isIn(SERVICES).withMessage('Choose from the listed services'),
    body('message').optional({ values: 'falsy' }).trim().isLength({ max: 3000 }).withMessage('Please keep this under 3000 characters'),
    rules.honeypot(),
  ]),
  controller.create
);

module.exports = router;
