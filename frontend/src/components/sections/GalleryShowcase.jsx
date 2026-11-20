import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Photo from '../media/Photo';
import BeforeAfter from '../media/BeforeAfter';
import Lightbox from '../media/Lightbox';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Reveal from '../Reveal';
import useParallax from '../../hooks/useParallax';
import { photo } from '../../content/photos';
import { floatUp, inViewOnce } from '../../utils/motion';

const columns = [
  ['ba1-after', 'salon-palms', 'ba7-after', 'nails-at-elite'],
  ['ba8-after', 'salon-retail', 'ba2-after', 'blowdry-at-elite'],
];

function Tile({ image, onOpen, ratio }) {
  return (
    <motion.li variants={floatUp} initial="hidden" whileInView="visible" viewport={inViewOnce}>
      <button type="button" onClick={onOpen} className="group frame relative block w-full overflow-hidden text-left" data-cursor={image.pair ? 'Compare' : 'View'} aria-label={`Open: ${image.alt}`}>
        <span className="zoom-frame block" style={{ aspectRatio: ratio }}>
          <Photo image={image} sizes="(min-width: 1024px) 26vw, 50vw" className="h-full w-full object-cover" />
        </span>
        {image.pair && <span className="label absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1.5 text-[0.5625rem] text-cherry backdrop-blur-sm">Before &amp; after</span>}
      </button>
    </motion.li>
  );
}

// 05 - The gallery: a drag-to-compare transformation beside two columns of the salon's work that drift
// at different speeds as you scroll.
export default function GalleryShowcase() {
  const images = useMemo(() => columns.flat().map(photo), []);
  const [index, setIndex] = useState(null);
  const a = useRef(null);
  const b = useRef(null);
  const ya = useParallax(a, 40);
  const yb = useParallax(b, -50);
  const ratios = ['4/5', '1/1', '4/5', '3/4'];

  return (
    <section className="overflow-hidden bg-champagne py-section" aria-labelledby="gallery-title">
      <div className="shell grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-12 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeader id="gallery-title" eyebrow="The gallery" numeral="05" title={[{ text: 'Real clients.' }, { text: 'Real transformations.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
            Every photo here is our own work, from soft balayage to bold colour changes. Drag the line to see the difference.
          </SectionHeader>
          <Reveal>
            <BeforeAfter before={photo('ba4-before')} after={photo('ba4-after')} sizes="(min-width: 1024px) 36vw, 100vw" className="mx-auto w-full max-w-md lg:max-w-none" />
            <p className="mt-4 text-center text-[0.8125rem] text-muted lg:text-left">{photo('ba4-after').alt.replace('After: ', '')}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6 lg:col-start-7">
          {[columns[0], columns[1]].map((col, c) => (
            <motion.ul key={c} ref={c ? b : a} style={{ y: c ? yb : ya }} className={`flex flex-col gap-3 sm:gap-4 ${c ? 'pt-16 lg:pt-28' : ''}`}>
              {col.map((key, i) => (
                <Tile key={key} image={photo(key)} ratio={ratios[(i + c) % ratios.length]} onOpen={() => setIndex(images.findIndex((im) => im.id === key))} />
              ))}
            </motion.ul>
          ))}
        </div>
      </div>

      <Reveal className="shell mt-16 flex justify-center lg:mt-24">
        <Button to="/gallery" variant="outline" arrow>
          View the full gallery
        </Button>
      </Reveal>

      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  );
}
