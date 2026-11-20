import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import PageHero from '../components/sections/PageHero';
import FinalCta from '../components/sections/FinalCta';
import Transformations from '../components/sections/Transformations';
import Photo from '../components/media/Photo';
import Lightbox from '../components/media/Lightbox';
import useSeo from '../hooks/useSeo';
import useMediaQuery from '../hooks/useMediaQuery';
import { galleryCategories, galleryPhotos } from '../content/photos';
import { ease } from '../utils/motion';

// Distribute photos across columns, always adding to the shortest one, so the masonry stays balanced.
function toColumns(images, count) {
  const cols = Array.from({ length: count }, () => ({ h: 0, items: [] }));
  images.forEach((img) => {
    const col = cols.reduce((a, b) => (b.h < a.h ? b : a));
    col.items.push(img);
    col.h += img.height / img.width;
  });
  return cols.map((c) => c.items);
}

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description: 'Hair transformations, colour, balayage, styling, nails and the salon itself: a gallery of real work from Elite Hair & Beauty in Walmer, Gqeberha.',
    path: '/gallery',
  });
  const all = useMemo(() => galleryPhotos(), []);
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(null);
  const wide = useMediaQuery('(min-width: 1024px)');
  const mid = useMediaQuery('(min-width: 640px)');
  const shown = filter === 'all' ? all : all.filter((p) => p.cats.includes(filter));
  const columns = toColumns(shown, wide ? 3 : mid ? 2 : 2);
  const counts = Object.fromEntries(galleryCategories.map((c) => [c.id, c.id === 'all' ? all.length : all.filter((p) => p.cats.includes(c.id)).length]));

  return (
    <>
      <PageHero variant="light" eyebrow="Real clients · Real results" title={['THE GALLERY']} label="The gallery" intro="Hair transformations, colour, balayage, styling, nails and our salon at The1054. Every photograph here is our own work." />

      <section className="bg-ivory pb-section" aria-label="Gallery">
        {/* Filters */}
        <div className="sticky top-0 z-30 border-y border-line-light bg-ivory/90 backdrop-blur-md">
          <div className="shell no-scrollbar flex gap-2 overflow-x-auto py-3 lg:justify-center" role="tablist" aria-label="Filter the gallery">
            {galleryCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`label relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 whitespace-nowrap transition-colors duration-700 ${filter === c.id ? 'text-white' : 'text-cherry hover:text-burgundy'}`}
              >
                {filter === c.id && <motion.span layoutId="gallery-filter" className="absolute inset-0 -z-10 rounded-full bg-burgundy" transition={{ duration: 0.9, ease }} />}
                {c.label}
                <span className={`text-[0.625rem] tabular-nums ${filter === c.id ? 'text-white/70' : 'text-muted'}`}>{counts[c.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <LayoutGroup>
          <div className="shell mt-10 grid gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }} role="tabpanel">
            {columns.map((col, c) => (
              <ul key={c} className="flex flex-col gap-3 sm:gap-4">
                <AnimatePresence mode="popLayout">
                  {col.map((img, i) => (
                    <motion.li
                      key={img.id}
                      layout
                      initial={{ y: 160 }}
                      animate={{ y: 0, transition: { duration: 4, ease, delay: Math.min(i * 0.12 + c * 0.08, 1) } }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.6, ease } }}
                      transition={{ layout: { duration: 1.2, ease } }}
                    >
                      <button
                        type="button"
                        className="group frame relative block w-full overflow-hidden text-left"
                        onClick={() => setIndex(shown.findIndex((s) => s.id === img.id))}
                        data-cursor={img.pair ? 'Compare' : 'View'}
                        aria-label={`Open: ${img.alt}`}
                      >
                        <span className="zoom-frame block" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
                          <Photo image={img} sizes="(min-width: 1024px) 31vw, 50vw" className="h-full w-full object-cover" />
                        </span>
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cherry/70 via-transparent to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-small text-ivory opacity-0 transition-[opacity,translate] duration-1000 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" aria-hidden="true">
                          {img.alt.replace('After: ', '')}
                        </span>
                        {img.pair && <span className="label absolute top-3 left-3 rounded-full bg-ivory/85 px-3 py-1.5 text-[0.5625rem] text-cherry backdrop-blur-sm">Before &amp; after</span>}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ))}
          </div>
        </LayoutGroup>
      </section>

      <Transformations numeral="01" eyebrow="Transformations" title={[{ text: 'Drag to see' }, { text: 'the difference.', className: 'italic text-blush' }]} link={false} />

      <FinalCta title={[{ text: 'Experience it' }, { text: 'for yourself.', className: 'italic text-blush' }]} photos={['ba2-after', 'salon-lounge']} />

      <Lightbox images={shown} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </>
  );
}
