const { matchedData } = require('express-validator');
const enquiries = require('../services/enquiry.service');

exports.create = async (req, res) => {
  const { website, ...values } = matchedData(req); // honeypot, never stored
  const enquiry = await enquiries.create(values);
  res.status(201).json({ success: true, message: 'Thank you. Your message is with us.', data: { reference: enquiry.id } });
};
