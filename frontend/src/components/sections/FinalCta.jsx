import { Phone } from 'lucide-react';
import RevealPhoto from '../media/RevealPhoto';
import Parallax from '../motion/Parallax';
import Button from '../ui/Button';
import Eyebrow from '../ui/Eyebrow';
import SplitHeading from '../ui/SplitHeading';
import Reveal from '../Reveal';
import { booking, site } from '../../content/site';

// The closing invitation, on deep burgundy, with two of the salon's own photographs drifting at the edges.
export default function FinalCta({
  title = [{ text: 'Ready for your next' }, { text: 'transformation?', className: 'italic text-blush' }],
  text = 'Let our team take care of you. Your next favourite salon experience starts here.',
  photos = ['ba3-after', 'blowdry-at-elite'],
}) {
  return (
    <section className="grain on-dark relative overflow-hidden bg-burgundy py-section text-ivory" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <Parallax speed={60} className="absolute top-[12%] left-[4%] w-[15vw] max-w-[15rem]">
          <RevealPhoto id={photos[0]} className="aspect-[3/4] opacity-80" sizes="15vw" />
        </Parallax>
        <Parallax speed={-50} className="absolute right-[4%] bottom-[10%] w-[17vw] max-w-[17rem]">
          <RevealPhoto id={photos[1]} className="aspect-[4/5] opacity-80" sizes="17vw" delay={0.3} />
        </Parallax>
      </div>
      <div className="shell relative flex flex-col items-center gap-stack text-center">
        <Eyebrow tone="dark" center>
          Book your appointment
        </Eyebrow>
        <SplitHeading id="cta-title" parts={title} className="statement max-w-[16ch] text-[clamp(2rem,0.8rem+5.2vw,7rem)] leading-[0.95] text-ivory" />
        <Reveal className="max-w-[30rem] text-lead text-ivory/80">{text}</Reveal>
        <Reveal className="mt-4 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-6">
          <Button to="/book" variant="ivory" arrow className="w-full sm:w-auto">
            Book your appointment
          </Button>
          <Button href={`tel:${site.tel}`} variant="outline-light" className="w-full sm:w-auto">
            <Phone className="size-4" strokeWidth={1.25} aria-hidden="true" />
            {site.phone}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
