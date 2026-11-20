const { WeddingEnquiry } = require('../models');
const mail = require('./mail.service');
const env = require('../config/env');
const { formatDate, SIGNATURE } = require('../utils/format');

// Save first, then notify the salon and acknowledge the bride. A mail failure never loses an enquiry.
exports.create = async (values) => {
  const enquiry = await WeddingEnquiry.create({
    ...values,
    venue: values.venue || null,
    partySize: values.partySize || null,
    message: values.message || null,
  });

  const summary = [
    `Name:          ${enquiry.name}`,
    `Wedding date:  ${formatDate(enquiry.weddingDate)}`,
    `Getting ready: ${enquiry.venue || '-'}`,
    `People:        ${enquiry.partySize || '-'}`,
    `Services:      ${enquiry.services.join(', ')}`,
    `Phone:         ${enquiry.phone}`,
    `Email:         ${enquiry.email}`,
    '',
    'About the day:',
    enquiry.message || '-',
    '',
    `Reference: #${enquiry.id}`,
  ].join('\n');

  try {
    if (mail.isConfigured()) {
      await mail.send({ to: env.mail.to, subject: `New wedding enquiry #${enquiry.id} (${enquiry.weddingDate})`, text: `A wedding enquiry came in through the website.\n\n${summary}`, replyTo: enquiry.email });
      await mail.send({
        to: enquiry.email,
        subject: 'Your wedding enquiry - Elite Hair & Beauty',
        text: `Dear ${enquiry.name},\n\nCongratulations, and thank you for thinking of us for your wedding. We have your enquiry and will be in touch to talk through your look, your bridal party and your timings.\n\n${summary}\n\n${SIGNATURE}`,
        replyTo: env.mail.to,
      });
      await enquiry.update({ notifiedAt: new Date() });
    } else {
      console.warn(`[wedding-enquiries] #${enquiry.id} saved, but no email was sent because SMTP is not configured.`);
    }
  } catch (error) {
    console.error(`[wedding-enquiries] #${enquiry.id} saved, but sending email failed:`, error.message);
  }
  return enquiry;
};
