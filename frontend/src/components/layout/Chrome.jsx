import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { ArrowUp, CalendarHeart } from 'lucide-react';
import SocialIcon from '../ui/SocialIcon';
import { site } from '../../content/site';
import useMediaQuery from '../../hooks/useMediaQuery';
import { ease } from '../../utils/motion';

// A hairline of dusty rose across the top of the window that fills as you read down the page.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-rose" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

// Phones: a compact "Book now" pill in the bottom-right corner, appearing once the hero has scrolled away (the
// hero has its own button). It sits level with the music button in the bottom-left corner (44px tall against the
// music button's 48px, so it's raised 2px to share its centre line) and opens the booking page inside the site.
export function MobileBookBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(() => scrollY.on('change', (y) => setShow(y > window.innerHeight * 0.8)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed right-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+2px)] z-40 sm:hidden"
          initial={{ y: '160%' }}
          animate={{ y: '0%', transition: { duration: 1.2, ease } }}
          exit={{ y: '160%', transition: { duration: 0.8, ease } }}
        >
          <Link
            to="/book"
            className="label flex h-11 items-center justify-center gap-2 rounded-full bg-burgundy px-5 text-[0.625rem] text-white shadow-[0_14px_30px_-14px_rgb(53_29_39/0.7)]"
          >
            <CalendarHeart className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
            Book now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// The social links, centred on the left edge of the screen. Shown from 1280px wide, where the page margin is wide
// enough that they never touch the content; on smaller screens they live in the menu and the footer. Small cherry chips so they read over every section.
export function SocialRail() {
  return (
    <div className="fixed top-1/2 left-2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex 2xl:left-5" aria-label="Social media">
      <span className="mb-1 h-12 w-px bg-rose/60" aria-hidden="true" />
      {site.socials.map((s) => (
        <a
          key={s.id}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-8 items-center justify-center rounded-full border border-ivory/15 bg-cherry/85 text-ivory shadow-[0_10px_24px_-12px_rgb(20_8_14/0.6)] backdrop-blur-md transition-colors duration-700 hover:border-blush hover:bg-blush hover:text-cherry"
          aria-label={`${s.label} ${s.handle} (opens in a new tab)`}
        >
          <SocialIcon id={s.id} className="size-3.5" />
        </a>
      ))}
      <span className="mt-1 h-12 w-px bg-rose/60" aria-hidden="true" />
    </div>
  );
}

// Back to top, desktop and tablet.
export function ScrollTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(() => scrollY.on('change', (y) => setShow(y > window.innerHeight * 1.5)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="fixed right-6 bottom-6 z-40 hidden size-12 items-center justify-center rounded-full border border-rose/40 bg-ivory/80 text-burgundy backdrop-blur-md transition-colors duration-700 hover:bg-burgundy hover:text-white sm:flex"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease } }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.6, ease } }}
        >
          <ArrowUp className="size-4" strokeWidth={1.25} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Desktop only: a soft dusty-rose ring trails the pointer and opens up over photographs and links, with a
// label where an element asks for one (data-cursor="View" / "Drag"). The normal pointer stays visible.
export function Cursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });
  const [state, setState] = useState({ mode: 'idle', label: '' });

  useEffect(() => setState({ mode: 'idle', label: '' }), [pathname]);

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button, input, select, textarea, label');
      if (!target) return setState({ mode: 'idle', label: '' });
      const label = target.getAttribute('data-cursor');
      if (label) return setState({ mode: 'label', label });
      if (target.matches('input, select, textarea')) return setState({ mode: 'hide', label: '' });
      return setState({ mode: 'link', label: '' });
    };
    const leave = () => setState({ mode: 'hide', label: '' });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;
  const size = state.mode === 'label' ? 88 : state.mode === 'link' ? 44 : 26;
  return (
    <motion.div className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-normal" style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border ${state.mode === 'label' ? 'border-transparent bg-cherry/85 backdrop-blur-sm' : 'border-rose/70'}`}
        animate={{ width: size, height: size, opacity: state.mode === 'hide' ? 0 : 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <AnimatePresence>
          {state.mode === 'label' && (
            <motion.span className="label text-[0.625rem] tracking-[0.24em] text-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.6, ease } }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
