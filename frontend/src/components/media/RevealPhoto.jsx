import { motion } from 'motion/react';
import Photo from './Photo';
import { SLIDE_DISTANCE, blurIn, duration, ease, inViewOnce, withDelay } from '../../utils/motion';

// How far a sliding card travels before it settles (px). Phones use the same distance; the section clips it.
const SLIDE = { left: { x: -SLIDE_DISTANCE }, right: { x: SLIDE_DISTANCE }, up: { y: SLIDE_DISTANCE } };

// A photograph that comes in the first time it scrolls into view. Add `zoom` for the hover zoom.
//   default (slide="up"): the whole framed card slides up from below into place, fully opaque the whole way
//   slide="left" | "right": the same, sideways
//   slide={false}:     blurs into focus inside its frame instead
//   Slides have no fade and no blur, and run 4 s on the site's ease-out curve.
//   <RevealPhoto id="salon-lounge" className="aspect-[4/5]" sizes="50vw" slide="right" />
export default function RevealPhoto({ id, image, className = '', imgClassName = '', sizes, priority, zoom = false, frame = true, slide = 'up', delay = 0, alt, position }) {
  const photo = <Photo id={id} image={image} sizes={sizes} priority={priority} alt={alt} className={`h-full w-full object-cover ${imgClassName}`} style={position ? { objectPosition: position } : undefined} />;
  const classes = `relative overflow-hidden ${frame ? 'frame' : ''} ${zoom ? 'zoom-frame' : ''} ${className}`;

  if (slide) {
    return (
      <motion.div
        className={classes}
        initial={SLIDE[slide]}
        whileInView={{ x: 0, y: 0 }}
        viewport={inViewOnce}
        transition={{ duration: duration.major, ease, delay }}
      >
        {photo}
      </motion.div>
    );
  }

  return (
    <div className={classes}>
      <motion.div className="h-full w-full" variants={delay ? withDelay(blurIn, delay) : blurIn} initial="hidden" whileInView="visible" viewport={inViewOnce}>
        {photo}
      </motion.div>
    </div>
  );
}
