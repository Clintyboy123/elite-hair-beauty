// Services. The service names are the ones the current site lists; the descriptions explain what each
// service is (no prices, durations or promises - current prices live on the Fresha booking pages).

export const hairIntro =
  'More than just great hair, a salon visit should leave you feeling refreshed, confident, and cared for. From the moment you walk in, we’re here to pamper you with expert styling and a warm, welcoming experience.';

export const hairServices = [
  {
    id: 'cutting',
    title: 'Ladies’ & men’s cutting',
    photo: 'sleek-bob',
    text: 'A cut shaped to your face, your hair’s natural movement and the way you actually live with it, from a fresh trim to a complete change of shape.',
    items: ['Ladies’ cuts', 'Men’s cuts', 'Restyles & trims'],
  },
  {
    id: 'colour',
    title: 'Foils & tints',
    photo: 'ba3-after',
    text: 'From full-head tints and root touch-ups to fine, hand-placed foils, colour is matched to your skin tone and built to stay rich between visits.',
    items: ['Foils', 'Tints', 'Colour refresh'],
  },
  {
    id: 'balayage',
    title: 'Balayage',
    photo: 'colour-waves',
    text: 'Hand-painted colour, placed where the light would naturally fall, for soft dimension that grows out gracefully.',
    items: ['Balayage', 'Blended lightening', 'Toning'],
  },
  {
    id: 'blowdry',
    title: 'Blow-drying & styling',
    photo: 'blowdry-salon',
    text: 'Smooth and glossy, full and bouncy, or loose, lived-in waves: a finish that holds its shape for days.',
    items: ['Blow-dries', 'Waves & curls', 'Occasion styling'],
  },
  {
    id: 'treatments',
    title: 'Brazilian Blowout & treatments',
    photo: 'blowdry-brush',
    text: 'Smoothing and repair treatments that tame frizz and bring back softness and shine, tailored to your hair’s condition after a consultation.',
    items: ['Brazilian Blowout', 'Hair treatments'],
  },
  {
    id: 'weddings',
    title: 'Wedding packages',
    photo: 'bridal-chignon',
    text: 'Bridal hair for you and your party, on the day and wherever you are getting ready.',
    items: ['Bridal hair', 'Bridal party hair'],
    to: '/weddings',
  },
];

export const beautyIntro =
  'From flawless brows to polished toes, we offer a full range of beauty treatments designed to help you relax and feel your absolute best. Whether it’s a speedy tint or a full pampering session, our expert team is here to take care of you – head to toe.';

export const beautyCategories = [
  {
    id: 'nails',
    title: 'Nails',
    numeral: '01',
    photo: 'nails-mauve',
    secondary: 'nails-at-elite',
    text: 'Hands and feet, finished with care: from a classic polish to long-wearing gel and sculpted acrylics with a little art.',
    items: ['Manicures', 'Pedicures', 'Gel nails', 'Acrylic nails', 'Nail art'],
  },
  {
    id: 'face',
    title: 'Face & eyes',
    numeral: '02',
    photo: 'lashes',
    secondary: 'eye-makeup',
    text: 'Treatments that bring out the best in your skin and frame your eyes, from a deep-cleansing facial to defined brows and lashes.',
    items: ['Facials', 'Lashes', 'Tinting', 'Make-up'],
  },
  {
    id: 'body',
    title: 'Body',
    numeral: '03',
    photo: 'massage',
    secondary: 'facial',
    text: 'Smooth, soothed and properly unwound: waxing done with care, and massage to melt the week away.',
    items: ['Waxing', 'Massage'],
  },
];

export const weddingIntro =
  'We’re here to make your special day effortlessly beautiful. From hair and makeup to beauty treatments, we’ll come to you and ensure every detail is perfect. Relax, enjoy the moment, and let us help you create memories that last a lifetime.';

export const weddingServices = [
  { id: 'bridal-hair', title: 'Bridal hair', text: 'Your hair, designed around your dress, your veil and the way you want to feel walking down the aisle.' },
  { id: 'bridal-makeup', title: 'Wedding make-up', text: 'Make-up that looks like you on your very best day, and holds from the first look to the last dance.' },
  { id: 'bridal-party', title: 'Your bridal party', text: 'Hair and make-up for your bridesmaids, mothers and everyone getting ready with you.' },
  { id: 'beauty-prep', title: 'Beauty before the day', text: 'Nails, lashes, tinting, waxing and facials in the weeks before, so you arrive relaxed and ready.' },
];

// Keep in step with backend/src/routes/weddingEnquiry.routes.js
export const weddingServiceOptions = ['Bridal hair', 'Wedding make-up', 'Bridal party hair', 'Bridal party make-up', 'Beauty treatments before the day', 'Not sure yet'];
