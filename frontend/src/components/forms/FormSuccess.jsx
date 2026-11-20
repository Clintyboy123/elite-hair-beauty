import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ease } from '../../utils/motion';
import { Check } from 'lucide-react';

// Shown in place of a form once it has been sent.
export default function FormSuccess({ title, children, onReset, resetLabel = 'Send another', tone = 'light' }) {
  const muted = tone === 'dark' ? 'text-mist' : 'text-muted';
  const ref = useRef(null);
  // The form collapses into this message, so bring it into view and move focus to it for screen readers.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    node.focus({ preventScroll: true });
  }, []);
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      className="flex flex-col items-center py-10 text-center outline-none md:items-start md:text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 4, ease } }}
      role="status"
    >
      <span className={`flex size-16 items-center justify-center rounded-full border ${tone === 'dark' ? 'border-blush/50 text-blush' : 'border-rose/50 text-rose'}`}>
        <Check className="size-6" strokeWidth={1.25} aria-hidden="true" />
      </span>
      <h3 className="statement mt-8 text-h3">{title}</h3>
      <div className={`mt-6 flex max-w-[38rem] flex-col gap-4 ${muted}`}>{children}</div>
      {onReset && (
        <button type="button" onClick={onReset} className={`text-link mt-8 ${tone === 'dark' ? 'text-ivory' : 'text-burgundy'}`}>
          <span className="rule" aria-hidden="true" />
          <span>{resetLabel}</span>
        </button>
      )}
    </motion.div>
  );
}
