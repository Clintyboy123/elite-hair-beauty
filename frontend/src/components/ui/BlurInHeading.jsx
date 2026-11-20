import { Fragment, useState } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ease } from '../../utils/motion';

// The highlight's fade: an even ease-in-out, so the colour change is visible the whole way.
const FADE = [0.37, 0, 0.63, 1];

// A heading whose letters come into focus one by one in a random order: each letter gets its own random delay,
// duration and starting blur, re-shuffled on every visit, so the title never assembles the same way twice.
// Only opacity and blur animate (no movement), and the letters stay inline, so the font's kerning and swash
// letters are untouched. Visitors who prefer reduced motion get a plain, gentle fade.
//   play:      start the entrance (e.g. once the welcome intro has handed over); default true
//   highlight: a colour each letter flashes to the moment the pointer touches it,
//              holding for 1 s and then fading evenly over 2.5 s, so moving across the title leaves a lingering trail
//   <BlurInHeading as="h1" label="Beauty, Elevated." lines={[{ text: 'BEAUTY,' }, { text: 'eLEVATED.' }]} highlight="#985e40" />
export default function BlurInHeading({ as = 'h1', id, label, lines, className = '', delay = 0.3, spread = 1.8, play = true, highlight }) {
  const Tag = as;
  const reduce = useReducedMotion();

  // Decided once per mount (a fresh shuffle on each page load), so re-renders never restart the animation.
  const [timing] = useState(() =>
    lines.map((line) =>
      [...line.text].map(() => ({
        delay: delay + Math.random() * spread,
        duration: 4 + Math.random() * 1.6, // major-animation spec: 4 s minimum
        blur: 14 + Math.random() * 18,
      }))
    )
  );

  // The letter takes the highlight colour at once, holds it for 1 s, then fades evenly back to the heading colour
  // over 2.5 s. This one fade uses a gentle ease-in-out rather than the site's front-loaded ease-out, which made
  // most of the colour vanish in the first moment; this way the copper visibly melts away.
  const flash = (e) => {
    if (!highlight) return;
    const el = e.currentTarget;
    const base = getComputedStyle(el.parentElement).color;
    animate(el, { color: [highlight, highlight, base] }, { duration: 3.5, times: [0, 1 / 3.5, 1], ease: FADE }).then(() => {
      el.style.color = '';
    });
  };

  return (
    <Tag id={id} className={className} aria-label={label}>
      {lines.map((line, l) => (
        <Fragment key={l}>
          <span className={line.className} aria-hidden="true">
            {[...line.text].map((char, c) => {
              const t = timing[l][c];
              const hidden = { opacity: 0, filter: reduce ? 'blur(0px)' : `blur(${t.blur}px)` };
              return (
                <motion.span
                  key={c}
                  initial={hidden}
                  animate={play ? { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : hidden}
                  transition={{ duration: reduce ? 1.2 : t.duration, delay: reduce ? delay : t.delay, ease }}
                  onPointerEnter={flash}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {l < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </Tag>
  );
}
