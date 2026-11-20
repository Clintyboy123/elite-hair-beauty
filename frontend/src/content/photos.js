// Photography, exported by tools/photos.py as WebP at up to three widths. photos.json lists each one's size,
// alt text, gallery categories, placeholder tone and (for licence-free stock images) a credit link.
// The gallery only ever shows the salon's own photographs; stock images are used on service pages.
import manifest from './photos.json';

const files = import.meta.glob('../assets/photos/*.webp', { eager: true, import: 'default' });
const url = (name) => files[`../assets/photos/${name}`];
const TARGETS = [640, 1280, 2000];

export const photo = (key) => {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown photo: ${key}`);
  const srcs = entry.sizes.map((w, i) => ({ w, src: url(`${key}-${TARGETS[i]}.webp`) }));
  const largest = srcs[srcs.length - 1];
  return {
    id: key,
    src: srcs[Math.min(1, srcs.length - 1)].src,
    largest: largest.src,
    srcSet: srcs.map((s) => `${s.src} ${s.w}w`).join(', '),
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    cats: entry.cats,
    tone: entry.tone,
    pair: entry.pair,
    credit: entry.credit,
  };
};

// Gallery filters, in display order. Ids match the categories in tools/photos.py.
export const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'transformations', label: 'Transformations' },
  { id: 'colour', label: 'Colour & highlights' },
  { id: 'balayage', label: 'Balayage' },
  { id: 'styling', label: 'Styling' },
  { id: 'nails', label: 'Nails & beauty' },
  { id: 'salon', label: 'The salon' },
];

// Lead with the hair (two transformations, then one photo of the salon or nail bar, and so on).
export const galleryPhotos = () => {
  const keys = Object.keys(manifest).filter((k) => manifest[k].cats.length);
  const hair = keys.filter((k) => manifest[k].pair || manifest[k].cats.includes('styling'));
  const rest = keys.filter((k) => !hair.includes(k));
  const order = [];
  while (hair.length || rest.length) order.push(...hair.splice(0, 2), ...rest.splice(0, 1));
  return order.map(photo);
};

export const transformations = () =>
  Object.keys(manifest)
    .filter((k) => manifest[k].pair)
    .map((k) => ({ after: photo(k), before: photo(manifest[k].pair) }));
