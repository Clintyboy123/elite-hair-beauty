const shop = require('../services/shop.service');

exports.list = async (req, res) => {
  res.set('Cache-Control', 'public, max-age=120');
  res.json({ success: true, data: await shop.list() });
};

exports.detail = async (req, res) => {
  res.set('Cache-Control', 'public, max-age=120');
  res.json({ success: true, data: await shop.detail(req.params.id) });
};
