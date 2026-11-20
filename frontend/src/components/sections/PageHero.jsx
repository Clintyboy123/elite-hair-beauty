import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Photo from '../media/Photo';
import SplitHeading from '../ui/SplitHeading';
import { SLIDE_DISTANCE, ease } from '../../utils/motion';
import { useIntro } from '../../context/IntroContext';

const rise = (delay, play) => ({
  initial: { opacity: 0, y: 24 },
  animate: play ? { opacity: 1, y: 0, transition: { duration: 4, ease, delay } } : { opacity: 0, y: 24 },
});

function HeroPhoto({ id, position, className = '', sizes, delay = 0 }) {
  const { introDone } = useIntro();
  const hidden = { opacity: 0, scale: 1.14, filter: 'blur(24px)' };
  return (
    <motion.div
      className={`h-full w-full ${className}`}
      initial={hidden}
      animate={introDone ? { opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : hidden}
      transition={{ duration: 6, ease, delay }}
    >
      <Photo id={id} priority sizes={sizes} className="h-full w-full object-cover" style={position ? { objectPosition: position } : undefined} />
    </motion.div>
  );
}

// Inner-page openings. Every page title is an H1 in BeautyLuxury (capitals, with a lowercase swash letter
// as the occasional flourish). Three compositions so each page has its own character:
//   split  - cherry stage, title left, photograph right (About, Beauty, Contact)
//   full   - full-bleed photograph, title over a shade (Hair, Team)
//   light  - powder-ivory stage for softer pages (Weddings, Shop, Gallery)
export default function PageHero({ variant = 'split', size = 'lg', eyebrow, title, label, intro, photo, position, secondPhoto, children }) {
  const { introDone } = useIntro();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const dark = variant !== 'light';
  // Every line of a page title sits on the same left edge (one grid line, no staggered indents).
  const titleParts = title.map((t, i) => ({ text: t, break: i < title.length - 1 }));

  const text = (
    <div className={`relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left ${dark ? 'text-ivory' : 'text-cherry'}`}>
      <motion.p className={`label flex items-center gap-4 ${dark ? 'text-blush' : 'text-rose-ink'}`} {...rise(0.2, introDone)}>
        <motion.span className="block h-px w-8 origin-left bg-current opacity-70" initial={{ scaleX: 0 }} animate={introDone ? { scaleX: 1, transition: { duration: 4, ease, delay: 0.3 } } : { scaleX: 0 }} aria-hidden="true" />
        {eyebrow}
        <span className="block h-px w-8 bg-current opacity-70 lg:hidden" aria-hidden="true" />
      </motion.p>
      <SplitHeading as="h1" play={introDone} delay={0.4} gap={0.16} label={label} parts={titleParts} className={`display mt-6 lg:mt-8 ${size === 'md' ? 'text-[clamp(2.75rem,1.1rem+4.4vw,6.25rem)] leading-[0.94]' : 'text-h1'}`} />
      {intro && (
        <motion.p className={`mt-6 max-w-[30rem] text-lead lg:mt-8 ${dark ? 'text-ivory/80' : 'text-muted'}`} {...rise(1.1, introDone)}>
          {intro}
        </motion.p>
      )}
      {children && (
        <motion.div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-8 lg:mt-10" {...rise(1.4, introDone)}>
          {children}
        </motion.div>
      )}
    </div>
  );

  if (variant === 'full') {
    return (
      <section ref={ref} className="grain relative isolate flex min-h-[88svh] items-end overflow-hidden bg-cherry">
        <motion.div className="absolute inset-0" style={{ y }}>
          <HeroPhoto id={photo} position={position} sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-cherry via-cherry/55 to-cherry/10" aria-hidden="true" />
        <div className="absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-cherry/70 to-transparent lg:block" aria-hidden="true" />
        <div className="shell relative pt-40 pb-16 lg:pb-24">{text}</div>
      </section>
    );
  }

  if (variant === 'light') {
    return (
      <section ref={ref} className="relative overflow-hidden bg-ivory pt-32 pb-section lg:pt-40">
        <div className="shell grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className={photo ? 'lg:col-span-6' : 'lg:col-span-10'}>{text}</div>
          {photo && (
            <div className="relative lg:col-span-5 lg:col-start-8">
              {/* Framed image cards slide up into place (no fade, no blur); the outer layer carries the parallax. */}
              <motion.div className="relative ml-auto w-[86%]" style={{ y }}>
                <motion.div className="frame relative aspect-[4/5] overflow-hidden" initial={{ y: SLIDE_DISTANCE }} animate={introDone ? { y: 0 } : { y: SLIDE_DISTANCE }} transition={{ duration: 4, ease, delay: 0.3 }}>
                  <Photo id={photo} priority sizes="(min-width: 1024px) 36vw, 86vw" className="h-full w-full object-cover" style={position ? { objectPosition: position } : undefined} />
                </motion.div>
              </motion.div>
              {secondPhoto && (
                <motion.div
                  className="frame absolute bottom-[-10%] left-0 aspect-[3/4] w-[42%] overflow-hidden shadow-[0_40px_60px_-30px_rgb(42_23_32/0.4)]"
                  initial={{ y: SLIDE_DISTANCE }}
                  animate={introDone ? { y: 0 } : { y: SLIDE_DISTANCE }}
                  transition={{ duration: 4, ease, delay: 0.6 }}
                >
                  <Photo id={secondPhoto} priority sizes="(min-width: 1024px) 16vw, 42vw" className="h-full w-full object-cover" />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // split
  return (
    <section ref={ref} className="grain relative isolate overflow-hidden bg-cherry">
      <div className="grid min-h-[92svh] grid-cols-1 lg:grid-cols-12">
        <div className="shell flex items-end pt-36 pb-14 lg:col-span-6 lg:items-center lg:pt-40 lg:pb-20 lg:pr-0">{text}</div>
        <div className="relative h-[62svh] overflow-hidden lg:col-span-6 lg:h-auto">
          <motion.div className="absolute inset-0" style={{ y }}>
            <HeroPhoto id={photo} position={position} sizes="(min-width: 1024px) 50vw, 100vw" />
          </motion.div>
          <div className="absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-cherry/50 to-transparent lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
