// Genuine Google reviews, as shown on the current site's review widget. Quoted word for word; "…" marks
// where a long review has been shortened. Never add a review that is not on the salon's Google profile.
export const reviews = [
  {
    id: 'karien',
    name: 'Karien Dutton',
    date: 'June 2023',
    quote: 'From the moment I stepped into the salon, I knew I was in for something special.',
    text: 'From the moment I stepped into the salon, I knew I was in for something special. … The salon ambiance was warm and inviting, creating a relaxing atmosphere that enhanced the overall experience.',
  },
  {
    id: 'judy',
    name: 'Judy Boland',
    date: 'May 2023',
    quote: 'The staff were friendly, helpful, genuinely kind.',
    text: 'I was a last minute booking and from the moment they answered the phone the staff were friendly, helpful, genuinely kind. They’re organized and prompt. The add on services… coffee, complimentary shoulder massage… oh wow, just awesome… just made my day perfect.',
  },
  {
    id: 'nadine',
    name: 'Nadine Hill',
    date: 'June 2023',
    quote: 'Carla was so amazing and such a vibe!',
    text: 'Carla was so amazing and such a vibe! I cannot wait to go back. Such friendly staff all round.',
  },
  {
    id: 'razia',
    name: 'Razia Gaida',
    date: 'April 2023',
    quote: 'Wonderful washes with head massage.',
    text: 'Friendly staff, wonderful washes with head massage and always happy with the results.',
  },
  {
    id: 'chene',
    name: 'Chene Cattaneo',
    date: 'June 2023',
    quote: 'Always my go to salon.',
    text: 'Always a lovely experience going to Elite Hair. … Always my go to salon.',
  },
  {
    id: 'karen',
    name: 'Karen Meij',
    date: 'May 2023',
    quote: 'What an amazing experience!',
    text: 'What an amazing experience!!! Well done Elite Hair & Beauty!!!!',
  },
];

export const review = (id) => reviews.find((r) => r.id === id);
