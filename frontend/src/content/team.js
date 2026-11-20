// The team, names, roles and booking links exactly as on the current site's About page (November 2026).
// No biographies exist yet; add a `bio` line to anyone and it appears on the Team page.

const book = (eid, extra = '') => `https://www.fresha.com/book-now/elite-hair-and-beauty-gwwee44q/services?lid=428860&eid=${eid}${extra}&pId=400236`;

export const teamGroups = [
  {
    id: 'stylists',
    title: 'Our stylists',
    members: [
      { id: 'carla', name: 'Carla', role: 'Owner / Stylist', photo: 'carla', booking: book(1255088) },
      { id: 'nikki', name: 'Nikki', role: 'Stylist', photo: 'nikki', booking: book(2263860) },
      { id: 'erin', name: 'Erin', role: 'Stylist', photo: 'erin', booking: book(2670458) },
      { id: 'stacey', name: 'Stacey', role: 'Stylist', photo: 'stacey', booking: book(2986256) },
      { id: 'britney', name: 'Britney', role: 'Stylist', photo: 'britney', booking: book(4514380, '&share') },
      { id: 'emma', name: 'Emma', role: 'Stylist', photo: 'emma', booking: book(4958309, '&share=true') },
      { id: 'dane', name: 'Dané', role: 'Stylist', photo: 'dane', booking: book(5010469, '&share=true') },
    ],
  },
  {
    id: 'beauty',
    title: 'Our beauty team',
    members: [
      {
        id: 'ilahm',
        name: 'Ilahm',
        role: 'Beautician',
        photo: 'ilahm',
        booking: 'https://www.fresha.com/a/nails-beauty-by-ilahm-gqeberha-elite-hair-beauty-254-main-road-wagms7o7/booking?menu=true',
      },
      {
        id: 'megan',
        name: 'Megan',
        role: 'Health and Beauty',
        photo: 'megan',
        booking: 'https://www.fresha.com/a/elegance-health-beauty-salon-gqeberha-254-main-road-zca9ve3e/booking?pId=400236',
      },
    ],
  },
  {
    id: 'salon',
    title: 'Salon co-ordinator',
    members: [{ id: 'monique', name: 'Monique', role: 'Salon Co-ordinator', photo: 'monique' }],
  },
  {
    id: 'operators',
    title: 'Our operators',
    members: [
      { id: 'sally', name: 'Sally', role: 'Blowdry Specialist', photo: 'sally', booking: book(2780471) },
      { id: 'melody', name: 'Melody', role: 'Operator', photo: 'melody' },
      { id: 'rhina', name: 'Rhina', role: 'Operator', photo: 'rhina' },
      { id: 'angie', name: 'Angie', role: 'Operator', photo: 'angie' },
    ],
  },
];

export const team = teamGroups.flatMap((g) => g.members);
export const stylists = teamGroups[0].members;
