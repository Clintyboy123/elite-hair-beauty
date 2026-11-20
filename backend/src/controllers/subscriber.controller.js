const { matchedData } = require('express-validator');
const subscribers = require('../services/subscriber.service');

exports.create = async (req, res) => {
  const { email, source } = matchedData(req);
  await subscribers.subscribe(email, source);
  // Same answer whether the address is new or already subscribed, so the form never reveals who is on the list.
  res.status(201).json({ success: true, message: 'Thank you, you’re on the list.' });
};
