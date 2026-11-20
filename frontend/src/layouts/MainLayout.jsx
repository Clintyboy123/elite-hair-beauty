import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Cursor, MobileBookBar, ScrollProgress, ScrollTop, SocialRail } from '../components/layout/Chrome';
import MusicPlayer from '../components/layout/MusicPlayer';
import Intro from '../components/layout/Intro';
import { IntroContext } from '../context/IntroContext';
import { ease } from '../utils/motion';

// Scroll to an anchor (e.g. /contact#form) once the new page has arrived.
function useHashScroll(pathname, hash) {
  useEffect(() => {
    if (!hash) return undefined;
    let tries = 0;
    let timer;
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) {
        if (tries++ < 60) timer = setTimeout(go, 100);
        return;
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    timer = setTimeout(go, 900);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
}

// Page change: a cherry curtain rises over the old page (under 1 s, it blocks the next page), the new page loads
// beneath it at the top, and the curtain carries on upwards over 3 s to reveal it.
function Curtain({ reveal }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[80] flex origin-bottom items-center justify-center bg-cherry"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.85, ease } }}
        aria-hidden="true"
      />
      {reveal && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] bg-cherry"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 3, ease, delay: 0.15 } }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default function MainLayout({ children }) {
  const location = useLocation();
  const [firstPage, setFirstPage] = useState(true);
  // The welcome intro plays on every full load (dev screenshots with ?qa skip it). Page entrances wait for it.
  const [withIntro] = useState(() => !(import.meta.env.DEV && new URLSearchParams(window.location.search).has('qa')));
  const [introDone, setIntroDone] = useState(!withIntro);
  const reveal = useCallback(() => setIntroDone(true), []);
  // The welcome voice: heard during the intro if the browser allows sound, otherwise at the first click. The
  // music waits for it.
  const [voiceDone, setVoiceDone] = useState(!withIntro);
  const finishVoice = useCallback(() => setVoiceDone(true), []);
  useHashScroll(location.pathname, location.hash);

  return (
    <IntroContext.Provider value={{ introDone, voiceDone, finishVoice }}>
      {/* Stays mounted so its own fade-out can play after it hands over. */}
      {withIntro && <Intro onReveal={reveal} onVoiceDone={finishVoice} voiceDone={voiceDone} />}
      <a href="#main" className="label sr-only z-[110] bg-ivory px-4 py-3 text-cherry focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setFirstPage(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      >
        <motion.div key={location.pathname} className="flex min-h-dvh flex-col" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.85, ease } }}>
          <Curtain reveal={!firstPage} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>

      <SocialRail />
      <MusicPlayer />
      <MobileBookBar />
      <ScrollTop />
      <Cursor />
    </IntroContext.Provider>
  );
}
