const { matchedData } = require('express-validator');
const weddings = require('../services/weddingEnquiry.service');

exports.create = async (req, res) => {
  const { website, ...values } = matchedData(req); // honeypot, never stored
  const enquiry = await weddings.create(values);
  res.status(201).json({ success: true, message: 'Thank you. We have your wedding enquiry and will be in touch.', data: { reference: enquiry.id } });
};
