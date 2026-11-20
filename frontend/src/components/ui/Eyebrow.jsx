import { motion } from 'motion/react';
import { drawLine, fade, inViewOnce } from '../../utils/motion';

// Section label: "01 —— THE ELITE EXPERIENCE". tone: 'light' on light grounds, 'dark' on dark grounds.
// centered: on phones every eyebrow sits on the centre axis; from md up it aligns left unless `center` is set.
export default function Eyebrow({ numeral, children, tone = 'light', center = false, className = '', animate = true }) {
  const colour = tone === 'dark' ? 'text-blush' : 'text-rose-ink';
  const props = animate ? { initial: 'hidden', whileInView: 'visible', viewport: inViewOnce } : {};
  return (
    <motion.p className={`label flex items-center justify-center gap-4 ${center ? '' : 'md:justify-start'} ${colour} ${className}`} {...props}>
      {numeral && (
        <motion.span variants={fade} className="statement text-[1.125rem] font-normal tracking-[0.06em] normal-case tabular-nums">
          {numeral}
        </motion.span>
      )}
      <motion.span variants={drawLine} className="block h-px w-10 origin-left bg-current opacity-60" aria-hidden="true" />
      <motion.span variants={fade}>{children}</motion.span>
      {/* Centred eyebrows get a matching rule on the other side, so they sit symmetrically on the axis. */}
      <motion.span variants={drawLine} className={`block h-px w-10 origin-right bg-current opacity-60 ${center ? '' : 'md:hidden'}`} aria-hidden="true" />
    </motion.p>
  );
}
