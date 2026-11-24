import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import BlurInHeading from '../ui/BlurInHeading';
import useScrollLock from '../../hooks/useScrollLock';
import { ease } from '../../utils/motion';
import { asset } from '../../utils/asset';

// The welcome, on every full load of the site: "WELCOME" comes into focus letter by letter on the cherry stage,
// the welcome voice plays by itself, and when it ends the screen fades away to reveal the page. Nothing to click.
//
// The welcome is heard on every load, including every refresh. Browsers decide whether a site may play sound
// before the visitor has clicked or tapped on it: where they allow it, the voice plays automatically during the
// intro. Where they block it (Safari by default, Chrome until the page has been clicked), the intro carries on
// silently and hands over on time, and the voice plays at the visitor's first click, tap or key press anywhere on
// the site (during the intro, the intro waits for it). The background music waits until the voice has finished.
// "Skip intro" skips the voice too; turning the music on by hand also cancels a voice still waiting.
// Trimmed to the spoken part plus its natural tail (2.8 s), so the music can follow straight on. Bump ?v= when
// replacing the file so browsers fetch the new one.
const SOUND = asset('audio/welcome.m4a?v=2026-11-20b');
const SOUND_START = 1.7; // seconds: once the word has come into focus
const SILENT_HOLD = 2.2; // seconds the word stays on screen when the browser blocks the sound
const MAX_WAIT = 9; // seconds of playback before handing over regardless

export default function Intro({ onReveal, onVoiceDone, voiceDone }) {
  const audioRef = useRef(null);
  const holdRef = useRef(0);
  const [phase, setPhase] = useState('in'); // in -> playing | silent -> out
  const visible = phase !== 'out';
  useScrollLock(visible);

  const finish = useCallback(() => {
    clearTimeout(holdRef.current);
    setPhase('out');
    onReveal(); // safe to call more than once
  }, [onReveal]);

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error('no audio'));
    return audio.play().then(() => {
      clearTimeout(holdRef.current);
      setVoicePlaying(true);
      setPhase((p) => (p === 'out' ? p : 'playing'));
    });
  }, []);

  // Play the voice by itself once the word is legible. If the browser blocks it, hold the word briefly, then go on.
  useEffect(() => {
    const t = setTimeout(() => {
      tryPlay().catch(() => {
        setPhase((p) => (p === 'in' ? 'silent' : p));
        holdRef.current = setTimeout(finish, SILENT_HOLD * 1000);
      });
    }, SOUND_START * 1000);
    return () => clearTimeout(t);
  }, [tryPlay, finish]);

  // Blocked? The visitor's first click, tap or key press unlocks the sound - during the intro or after it -
  // and the voice plays right then. (Clicks on "Skip intro" and on the music player are left to those controls.)
  const [voicePlaying, setVoicePlaying] = useState(false);
  useEffect(() => {
    if (voiceDone || voicePlaying) return undefined;
    const events = ['pointerdown', 'keydown', 'touchend'];
    const unlock = (e) => {
      if (e.target.closest?.('[data-skip-intro], [data-music-player]')) return;
      tryPlay().catch(() => {});
    };
    events.forEach((ev) => window.addEventListener(ev, unlock, true));
    return () => events.forEach((ev) => window.removeEventListener(ev, unlock, true));
  }, [voiceDone, voicePlaying, tryPlay]);

  // Never hold the visitor longer than the voice needs.
  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const t = setTimeout(finish, MAX_WAIT * 1000);
    return () => clearTimeout(t);
  }, [phase, finish]);

  const voiceOver = useCallback(() => {
    setVoicePlaying(false);
    onVoiceDone();
  }, [onVoiceDone]);

  // A music button press (or "Skip intro") cancels a voice that hasn't played yet.
  useEffect(() => {
    if (voiceDone && !voicePlaying) audioRef.current?.pause();
  }, [voiceDone, voicePlaying]);

  const skip = () => {
    audioRef.current?.pause();
    finish();
    voiceOver();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={SOUND}
        preload="auto"
        onEnded={() => {
          finish();
          voiceOver();
        }}
        onError={() =>
          setTimeout(() => {
            finish();
            voiceOver();
          }, 1200)
        }
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            className="grain fixed inset-0 z-[99] flex flex-col items-center justify-center bg-cherry text-ivory"
            role="dialog"
            aria-label="Welcome to Elite Hair & Beauty"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 1.6, ease } }}
          >
            <motion.div exit={{ filter: 'blur(14px)', scale: 1.04, transition: { duration: 1.6, ease } }}>
              {/* Generous tracking; the matching left padding cancels the space after the last letter so the word
                  sits optically centred. */}
              <BlurInHeading
                as="p"
                label="Welcome"
                delay={0.15}
                spread={0.9}
                className="display pl-[0.32em] text-[clamp(2.75rem,0.8rem+7.6vw,8.75rem)] leading-none tracking-[0.32em]"
                lines={[{ text: 'WELCOME' }]}
              />
            </motion.div>

            <motion.button
              type="button"
              data-skip-intro
              onClick={skip}
              className="label absolute bottom-[max(2rem,env(safe-area-inset-bottom))] min-h-11 px-4 text-[0.625rem] text-mist transition-colors duration-700 hover:text-ivory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1.2, ease, delay: 1 } }}
            >
              Skip intro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
