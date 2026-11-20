import { Fragment } from 'react';
import { motion } from 'motion/react';
import { inViewOnce, lineUp, stagger } from '../../utils/motion';

// A heading whose words rise out of their own masks, one after another.
// `parts`: a string, or an array of { text, className, break } (className styles that run, e.g. an italic accent).
// The sentence is read once by screen readers; the animated words are hidden from them.
// `play` (optional) controls it from outside (e.g. the hero); otherwise it plays when scrolled into view.
export default function SplitHeading({ as = 'h2', parts, className = '', delay = 0, play, gap = 0.08, label, id }) {
  const Tag = motion[as];
  const list = typeof parts === 'string' ? [{ text: parts }] : parts;
  const text = label || list.map((p) => p.text).join(' ');
  const trigger = play === undefined ? { whileInView: 'visible', viewport: inViewOnce } : { animate: play ? 'visible' : 'hidden' };

  return (
    <Tag id={id} className={className} aria-label={text} initial="hidden" variants={stagger(gap, delay)} {...trigger}>
      {list.map((part, p) => (
        <span key={p} className={part.className} aria-hidden="true">
          {part.text.split(' ').map((word, i, words) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pt-[0.08em] pb-[0.14em] -mb-[0.14em] align-top">
                <motion.span className="inline-block will-change-transform" variants={lineUp}>
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 && ' '}
            </Fragment>
          ))}
          {part.break ? <br /> : ' '}
        </span>
      ))}
    </Tag>
  );
}
