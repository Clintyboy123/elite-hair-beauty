import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Photo from '../media/Photo';
import SectionHeader from '../ui/SectionHeader';
import TextLink from '../ui/TextLink';
import { teamGroups } from '../../content/team';
import { floatUp, inViewOnce, stagger } from '../../utils/motion';

const people = [...teamGroups[0].members, ...teamGroups[1].members];

// 04 - Meet the team: a strip of portraits that scrolls sideways (swipe, trackpad, or the arrows).
export default function TeamStrip() {
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    const card = el.querySelector('li');
    el.scrollBy({ left: dir * (card.offsetWidth + 16) * 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const control = 'flex size-12 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors duration-700 hover:border-burgundy hover:bg-burgundy hover:text-white';

  return (
    <section className="overflow-hidden bg-ivory py-section" aria-labelledby="team-title">
      <div className="shell grid grid-cols-1 items-end gap-stack lg:grid-cols-12">
        <SectionHeader id="team-title" className="lg:col-span-7" eyebrow="Meet the team" numeral="04" title={[{ text: 'The people behind' }, { text: 'every look.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
          Passionate stylists and beauty therapists, led by owner and stylist Carla. Book with the person you love, right from their portrait.
        </SectionHeader>
        <div className="flex items-center justify-center gap-6 lg:col-span-5 lg:justify-end">
          <TextLink to="/team" className="text-burgundy">
            Meet everyone
          </TextLink>
          <div className="hidden gap-2 md:flex">
            <button type="button" className={control} onClick={() => scroll(-1)} aria-label="Previous team members">
              <ArrowLeft className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button type="button" className={control} onClick={() => scroll(1)} aria-label="More team members">
              <ArrowRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <motion.ul
        ref={track}
        className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)] pb-8 lg:mt-20"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        data-cursor="Drag"
        aria-label="Team members"
      >
        {people.map((p) => (
          <motion.li key={p.id} variants={floatUp} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[32vw] lg:w-[23vw] xl:w-[20vw]">
            <figure className="group flex flex-col items-center gap-4 text-center">
              <div className="zoom-frame frame relative aspect-[4/5] w-full bg-champagne">
                <Photo id={p.photo} sizes="(min-width: 1024px) 22vw, 72vw" className="h-full w-full object-cover object-top" />
              </div>
              <figcaption className="flex w-full flex-col items-center gap-1 text-center">
                <span>
                  <span className="statement block text-h4 text-cherry">{p.name}</span>
                  <span className="label mt-1 block text-[0.625rem] text-muted">{p.role}</span>
                </span>
                {p.booking && (
                  <a href={p.booking} target="_blank" rel="noopener noreferrer" className="label link-line mt-1 inline-flex min-h-11 items-center text-[0.625rem] text-burgundy">
                    Book with {p.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
