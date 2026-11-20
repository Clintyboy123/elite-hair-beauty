import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import Photo from '../media/Photo';
import Button from '../ui/Button';
import TextLink from '../ui/TextLink';
import BlurInHeading from '../ui/BlurInHeading';
import useMediaQuery from '../../hooks/useMediaQuery';
import { site } from '../../content/site';
import { useIntro } from '../../context/IntroContext';
import { ease } from '../../utils/motion';

const rise = (delay, play) => ({
  initial: { opacity: 0, y: 28 },
  animate: play ? { opacity: 1, y: 0, transition: { duration: 4, ease, delay } } : { opacity: 0, y: 28 },
});

// The opening scene. One idea: beauty coming into focus. The campaign photograph sharpens from a soft blur
// while "Beauty, Elevated." comes into focus letter by letter, in a random order on every visit, and crosses
// from the cherry stage into the picture.
export default function HomeHero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { introDone } = useIntro();
  const desktop = useMediaQuery('(min-width: 1024px) and (hover: hover)');

  // Scroll: the photograph drifts slower than the page, the type a little faster, and both soften away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const typeY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-18%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer: on desktop the photograph leans a few pixels towards the cursor (overdamped, so it never bounces).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 22 });
  const sy = useSpring(py, { stiffness: 40, damping: 22 });
  useEffect(() => {
    if (!desktop || reduce) return undefined;
    const move = (e) => {
      px.set((e.clientX / window.innerWidth - 0.5) * -18);
      py.set((e.clientY / window.innerHeight - 0.5) * -12);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [desktop, reduce, px, py]);

  return (
    <section ref={ref} className="grain relative isolate flex min-h-[100svh] overflow-hidden bg-cherry text-ivory" aria-labelledby="hero-title">
      {/* The photograph: full-bleed on phones, the right-hand page of the spread on desktop. */}
      <motion.div className="absolute inset-x-0 top-0 h-[74svh] overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[56%]" style={{ y: photoY }}>
        <motion.div
          className="h-full w-full"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 1.16, filter: 'blur(28px)' }}
          animate={introDone ? { opacity: 1, scale: 1.04, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : { opacity: 0, scale: 1.16, filter: 'blur(28px)' }}
          transition={{ duration: 6, ease }}
        >
          <Photo id="hero" priority sizes="(min-width: 1024px) 56vw, 100vw" className="h-full w-full object-cover object-[52%_22%]" />
        </motion.div>
        {/* Shade so type stays legible: from below on phones, from the left on desktop. */}
        <div className="absolute inset-0 bg-gradient-to-t from-cherry from-[2%] via-cherry/55 via-[30%] to-transparent to-[62%] lg:hidden" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cherry/60 to-transparent lg:hidden" aria-hidden="true" />
        <div className="absolute inset-y-0 -left-px hidden w-[48%] bg-gradient-to-r from-cherry from-[4%] via-cherry/60 to-transparent lg:block" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-cherry/70 to-transparent lg:block" aria-hidden="true" />
      </motion.div>

      <motion.div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pt-32 pb-8 lg:justify-center lg:pt-36 lg:pb-28" style={{ y: typeY, opacity: fadeOut }}>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p className="label flex items-center gap-3 whitespace-nowrap text-blush sm:gap-4" {...rise(0.2, introDone)}>
            <motion.span
              className="block h-px w-6 origin-left bg-current opacity-70 sm:w-10"
              initial={{ scaleX: 0 }}
              animate={introDone ? { scaleX: 1, transition: { duration: 4, ease, delay: 0.3 } } : { scaleX: 0 }}
              aria-hidden="true"
            />
            Walmer · Gqeberha · Est. {site.founded}
            <motion.span
              className="block h-px w-6 origin-right bg-current opacity-70 sm:w-10 lg:hidden"
              initial={{ scaleX: 0 }}
              animate={introDone ? { scaleX: 1, transition: { duration: 4, ease, delay: 0.3 } } : { scaleX: 0 }}
              aria-hidden="true"
            />
          </motion.p>

          <BlurInHeading
            as="h1"
            id="hero-title"
            label="Beauty, Elevated."
            delay={0.35}
            spread={1.8}
            play={introDone}
            highlight="#985e40"
            className="display mt-6 text-display text-ivory lg:mt-9"
            lines={[{ text: 'BEAUTY,' }, { text: 'eLEVATED.', className: 'lg:pl-[0.9em]' }]}
          />

          <motion.p className="mt-6 max-w-[21rem] text-body text-ivory/85 sm:text-lead lg:mt-10 lg:max-w-[27rem]" {...rise(1.3, introDone)}>
            A modern salon in Walmer with a passionate team, dedicated to how great you look when you leave, and how beautiful you feel.
          </motion.p>

          <motion.div className="mt-7 flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-8 lg:mt-10" {...rise(1.6, introDone)}>
            <Button to="/book" variant="ivory" arrow className="w-full sm:w-auto">
              Book your experience
            </Button>
            <TextLink to="/hair" className="text-ivory">
              Explore our services
            </TextLink>
          </motion.div>

          {/* The Google rating, in the flow directly under the buttons so it can never collide with them. */}
          <motion.a
            href={site.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 hidden items-center gap-4 text-small text-ivory/80 transition-colors duration-700 hover:text-ivory lg:mt-12 lg:flex"
            {...rise(2.2, introDone)}
          >
            <span className="statement text-h4 text-ivory italic">{site.reviewSummary.label}</span>
            <span className="h-6 w-px bg-ivory/30" aria-hidden="true" />
            <span className="link-line">{site.reviewSummary.count} Google reviews</span>
            <span className="sr-only">(opens in a new tab)</span>
          </motion.a>
        </div>

        {/* Pinned bottom-right, out of the way of the content. */}
        <motion.p className="label absolute right-[var(--spacing-gutter)] bottom-10 hidden items-center gap-3 text-ivory/70 lg:flex" {...rise(2.2, introDone)}>
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/20" aria-hidden="true">
            <span className="absolute inset-0 animate-scroll-cue bg-ivory" />
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
