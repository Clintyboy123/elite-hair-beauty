import Eyebrow from './Eyebrow';
import SplitHeading from './SplitHeading';
import Reveal from '../Reveal';

// The standard stack: eyebrow -> heading -> copy, on the site's one vertical rhythm (gap-stack).
// Centred on phones; aligned left from md up unless `center`.
export default function SectionHeader({ id, eyebrow, numeral, title, as = 'h2', titleClass = 'statement text-h2', tone = 'light', center = false, children, className = '' }) {
  const copy = tone === 'dark' ? 'text-mist' : 'text-muted';
  return (
    <div className={`flex flex-col gap-stack text-center ${center ? 'items-center' : 'md:text-left'} ${className}`}>
      {eyebrow && (
        <Eyebrow numeral={numeral} tone={tone} center={center}>
          {eyebrow}
        </Eyebrow>
      )}
      <SplitHeading id={id} as={as} parts={title} className={titleClass} />
      {children && (
        <Reveal className={`mx-auto max-w-[36rem] text-lead ${center ? '' : 'md:mx-0'} ${copy}`}>
          {children}
        </Reveal>
      )}
    </div>
  );
}
