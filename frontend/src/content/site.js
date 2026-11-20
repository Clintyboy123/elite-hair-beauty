// Business details, all taken from the current elitehair.co.za (November 2026). Change them here only.

const FRESHA = 'https://www.fresha.com';

export const site = {
  name: 'Elite Hair & Beauty',
  url: 'https://www.elitehair.co.za',
  founded: 2014,
  phone: '041 581 0090',
  tel: '+27415810090',
  // The current site's WhatsApp button uses the salon number with this greeting.
  whatsapp: `https://wa.me/27415810090?text=${encodeURIComponent('Hi Elite Hair & Beauty, I am contacting you from your website...')}`,
  email: 'info@elitehair.co.za',
  careersEmail: 'dylan@elitehair.co.za',
  address: {
    building: 'The1054',
    street: '254 Main Road',
    suburb: 'Walmer',
    city: 'Gqeberha',
    region: 'Eastern Cape',
    country: 'South Africa',
  },
  geo: { lat: -33.98265, lng: 25.56835 },
  directions: 'https://www.google.com/maps/dir/?api=1&destination=Elite+Hair+%26+Beauty%2C+254+Main+Road%2C+Walmer%2C+Gqeberha',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.3847473996334!2d25.566161315213186!3d-33.98264998062488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e7ad1f6f11b4b8d%3A0x83fc528858f50379!2sElite%20Hair%20%26%20Beauty!5e0!3m2!1sen!2sza!4v1603979704642!5m2!1sen!2sza',
  reviewsUrl: 'https://maps.google.com/?cid=9510567258661127033',
  // As shown by the review widget on the current site. Update when the count moves on.
  reviewSummary: { label: 'Excellent', count: 482 },
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@elitehairpe', href: 'https://www.instagram.com/elitehairpe/' },
    { id: 'facebook', label: 'Facebook', handle: 'elitehairpe', href: 'https://www.facebook.com/elitehairpe' },
  ],
  hours: [
    { days: 'Monday – Friday', short: 'Mon – Fri', time: '8am – 5pm', open: [1, 2, 3, 4, 5], from: 8, to: 17 },
    { days: 'Saturday', short: 'Sat', time: '8am – 2pm', open: [6], from: 8, to: 14 },
    { days: 'Public holidays', short: 'Public holidays', time: '8am – 2pm' },
    { days: 'Sunday', short: 'Sun', time: 'Closed', open: [] },
  ],
};

// Online booking runs on Fresha. These are the exact destinations the current site links to.
export const booking = {
  // "Click to book online now" (contact page) and every general Book Now on the new site.
  main: `${FRESHA}/a/elite-hair-beauty-port-elizabeth-254-main-road-hj66ewer?pId=400236`,
  // The Hair "Book now" on the current services page: every hair service and its price.
  hair: `${FRESHA}/book-now/elite-hair-and-beauty-gwwee44q/all-offer?pId=400236`,
  // Beauty is booked directly with each therapist, who keeps her own Fresha diary.
  ilahm: `${FRESHA}/a/nails-beauty-by-ilahm-gqeberha-elite-hair-beauty-254-main-road-wagms7o7/booking?menu=true&pId=398642%2C400236`,
  megan: `${FRESHA}/a/elegance-health-beauty-salon-gqeberha-254-main-road-zca9ve3e/booking?pId=400236`,
};

export const nav = [
  { label: 'About', to: '/about' },
  {
    label: 'Services',
    to: '/hair',
    children: [
      { label: 'Hair', to: '/hair', photo: 'colour-waves', note: 'Cuts, colour & treatments' },
      { label: 'Beauty', to: '/beauty', photo: 'lashes', note: 'Nails, lashes, facials & more' },
      { label: 'Weddings', to: '/weddings', photo: 'bridal-vine', note: 'Bridal hair & make-up' },
    ],
  },
  { label: 'Team', to: '/team' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
];

// The brands on the salon's retail wall (from the current site's brand strip).
export const brands = ['ghd', 'Biosense', 'Matrix', 'Kadus Professional', 'Moroccanoil', 'Nioxin', 'Wella', "The Captain's Beard"];

export const enquirySubjects = ['General question', 'Bookings', 'Online shop order', 'Products & advice', 'Joining the team', 'Something else'];

export const fullAddress = `${site.address.building}, ${site.address.street}, ${site.address.suburb}, ${site.address.city}`;
