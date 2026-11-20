import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BeforeAfter from '../media/BeforeAfter';
import SectionHeader from '../ui/SectionHeader';
import TextLink from '../ui/TextLink';
import { transformations } from '../../content/photos';
import { floatUp, inViewOnce, stagger } from '../../utils/motion';

// A sideways strip of drag-to-compare transformations, on cherry. Used on the Hair and Gallery pages.
export default function Transformations({ numeral, eyebrow = 'Before & after', title = [{ text: 'The proof is' }, { text: 'in the after.', className: 'italic text-blush' }], link = true }) {
  const track = useRef(null);
  const items = transformations();
  const scroll = (dir) => {
    const el = track.current;
    el.scrollBy({ left: dir * el.querySelector('li').offsetWidth * 1.5, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const control = 'flex size-12 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors duration-700 hover:border-ivory hover:bg-ivory hover:text-cherry';

  return (
    <section className="grain on-dark overflow-hidden bg-cherry py-section text-ivory" aria-labelledby="transformations-title">
      <div className="shell grid grid-cols-1 items-end gap-stack lg:grid-cols-12">
        <SectionHeader id="transformations-title" tone="dark" className="lg:col-span-7" eyebrow={eyebrow} numeral={numeral} title={title} titleClass="statement text-h2 text-ivory">
          Real clients, photographed in the salon. Drag across each photo to compare.
        </SectionHeader>
        <div className="flex items-center justify-center gap-6 lg:col-span-5 lg:justify-end">
          {link && (
            <TextLink to="/gallery" className="text-ivory">
              Full gallery
            </TextLink>
          )}
          <div className="hidden gap-2 md:flex">
            <button type="button" className={control} onClick={() => scroll(-1)} aria-label="Previous transformations">
              <ArrowLeft className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button type="button" className={control} onClick={() => scroll(1)} aria-label="More transformations">
              <ArrowRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <motion.ul
        ref={track}
        className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)] pb-8"
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        aria-label="Before and after photographs"
      >
        {items.map(({ before, after }) => (
          <motion.li key={after.id} variants={floatUp} className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[28vw]">
            <figure>
              <BeforeAfter before={before} after={after} sizes="(min-width: 1024px) 28vw, 80vw" />
              <figcaption className="mt-4 text-small text-mist">{after.alt.replace('After: ', '')}</figcaption>
            </figure>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
