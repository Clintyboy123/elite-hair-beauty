const { Subscriber } = require('../models');

// Adds an address to the newsletter list (or re-subscribes it). Export the list from the subscribers table
// into the salon's mailing tool (the current site uses Mailchimp).
exports.subscribe = async (email, source = 'newsletter') => {
  const normalised = email.trim().toLowerCase();
  const [subscriber, created] = await Subscriber.findOrCreate({ where: { email: normalised }, defaults: { email: normalised, source } });
  if (!created && subscriber.unsubscribedAt) await subscriber.update({ unsubscribedAt: null });
  return subscriber;
};
