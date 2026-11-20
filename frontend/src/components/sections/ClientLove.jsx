import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Eyebrow from '../ui/Eyebrow';
import TextLink from '../ui/TextLink';
import Reveal from '../Reveal';
import { reviews } from '../../content/reviews';
import { site } from '../../content/site';
import { ease } from '../../utils/motion';

// 06 - Client love: genuine Google reviews, one at a time, set like a magazine pull quote.
// Moves on by itself every 9 s; pauses while you hover or use the controls.
export default function ClientLove() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const r = reviews[i];

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % reviews.length), 9000);
    return () => clearTimeout(t);
  }, [i, paused]);

  const go = (step) => setI((n) => (n + step + reviews.length) % reviews.length);
  const control = 'flex size-12 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors duration-700 hover:border-burgundy hover:bg-burgundy hover:text-white';

  return (
    <section className="bg-white py-section" aria-labelledby="love-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-center gap-stack text-center lg:col-span-4 lg:items-start lg:text-left">
          <Eyebrow numeral="06">Client love</Eyebrow>
          <Reveal className="flex flex-col items-center gap-2 lg:items-start">
            <h2 id="love-title" className="statement text-h1 leading-none text-cherry italic">
              {site.reviewSummary.label}
            </h2>
            <p className="text-muted">Based on {site.reviewSummary.count} reviews on Google</p>
          </Reveal>
          <Reveal>
            <TextLink href={site.reviewsUrl} className="text-burgundy">
              Read our Google reviews
            </TextLink>
          </Reveal>
        </div>

        <div className="relative flex flex-col items-center text-center lg:col-span-7 lg:col-start-6 lg:items-start lg:text-left">
          <span className="statement pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[9rem] leading-none text-blush/60 select-none lg:-left-4 lg:translate-x-0" aria-hidden="true">
            “
          </span>
          <div className="relative min-h-[22rem] w-full sm:min-h-[18rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={r.id}
                className="flex flex-col items-center gap-8 pt-10 lg:items-start"
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 2.4, ease } }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.8, ease } }}
              >
                <blockquote className="statement max-w-[34ch] text-h3 text-cherry">{r.text}</blockquote>
                <figcaption className="flex flex-col items-center gap-1 lg:items-start">
                  <span className="label text-rose-ink">{r.name}</span>
                  <span className="text-small text-muted">Google review · {r.date}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <button type="button" className={control} onClick={() => go(-1)} aria-label="Previous review">
              <ArrowLeft className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
            <div className="flex gap-2" aria-hidden="true">
              {reviews.map((rv, n) => (
                <span key={rv.id} className={`h-px transition-all duration-1000 ${n === i ? 'w-10 bg-burgundy' : 'w-4 bg-burgundy/30'}`} />
              ))}
            </div>
            <button type="button" className={control} onClick={() => go(1)} aria-label="Next review">
              <ArrowRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
