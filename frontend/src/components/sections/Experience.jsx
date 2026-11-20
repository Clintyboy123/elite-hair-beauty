import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import Photo from '../media/Photo';
import RevealPhoto from '../media/RevealPhoto';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Reveal from '../Reveal';
import { review } from '../../content/reviews';
import { booking } from '../../content/site';
import { ease } from '../../utils/motion';

// What makes a visit to Elite special. Every moment here is something clients describe in their Google reviews.
const moments = [
  {
    id: 'welcome',
    title: 'A warm welcome',
    text: 'From the warm welcome to the personal touch, you’re looked after from the moment you walk in, whether you booked weeks ago or this morning.',
    photo: 'salon-reception',
    quote: review('judy'),
    quoteText: 'The staff were friendly, helpful, genuinely kind.',
  },
  {
    id: 'advice',
    title: 'Advice that’s personal',
    text: 'Highly skilled stylists who take the time to understand your hair, listen to what you want and give honest, expert advice.',
    photo: 'carla',
    quote: review('karien'),
    quoteText: 'From the moment I stepped into the salon, I knew I was in for something special.',
  },
  {
    id: 'wash',
    title: 'The wash & the massage',
    text: 'A relaxing hair wash with a head massage, and a shoulder massage to help you properly switch off.',
    photo: 'massage',
    quote: review('razia'),
    quoteText: 'Wonderful washes with head massage.',
  },
  {
    id: 'refreshments',
    title: 'Coffee, on us',
    text: 'Complimentary refreshments while you sit back in a bright, welcoming space, with friendly faces and good conversation.',
    photo: 'salon-lounge',
    quote: review('judy'),
    quoteText: 'Coffee, complimentary shoulder massage… oh wow, just awesome.',
  },
];

function Moment({ m, i, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  return (
    <div ref={ref} className="flex flex-col items-center gap-stack py-12 text-center lg:min-h-[78vh] lg:items-start lg:justify-center lg:py-0 lg:text-left">
      <RevealPhoto id={m.photo} className="aspect-[4/5] w-full max-w-md lg:hidden" sizes="100vw" />
      <Reveal className="flex flex-col items-center gap-stack lg:items-start">
        <span className="statement text-h4 text-blush italic tabular-nums">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="statement text-h3 text-ivory">{m.title}</h3>
        <p className="max-w-[30rem] text-mist">{m.text}</p>
        <blockquote className="max-w-[30rem] border-l-0 border-rose/60 lg:border-l lg:pl-6">
          <p className="statement text-h4 text-ivory/90 italic">“{m.quoteText}”</p>
          <footer className="label mt-3 text-blush">
            {m.quote.name} · Google review
          </footer>
        </blockquote>
      </Reveal>
    </div>
  );
}

// 03 - The Elite experience. Desktop: the photograph stays put and changes as each moment scrolls past.
export default function Experience() {
  const [active, setActive] = useState(0);
  return (
    <section className="grain on-dark bg-cherry py-section text-ivory" aria-labelledby="experience-title">
      <div className="shell">
        <div className="mx-auto mb-12 max-w-4xl lg:mb-20">
          <SectionHeader
            id="experience-title"
            center
            tone="dark"
            eyebrow="The Elite experience"
            numeral="03"
            title={[{ text: 'Your time.' }, { text: 'Your moment.' }, { text: 'Your experience.', className: 'italic text-blush' }]}
            titleClass="statement text-h2 text-ivory"
          >
            It’s all about you. Our goal is to exceed your expectations, so you leave with the look you love and the relaxed, refreshed feeling you deserve.
          </SectionHeader>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="frame sticky top-[11vh] h-[78vh] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={moments[active].photo}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 2.4, ease } }}
                  exit={{ opacity: 0, transition: { duration: 1.6, ease } }}
                >
                  <Photo id={moments[active].photo} sizes="45vw" className="h-full w-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute right-6 bottom-6 flex gap-2" aria-hidden="true">
                {moments.map((m, i) => (
                  <span key={m.id} className={`h-px transition-all duration-1000 ${i === active ? 'w-10 bg-ivory' : 'w-4 bg-ivory/40'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {moments.map((m, i) => (
              <Moment key={m.id} m={m} i={i} onActive={setActive} />
            ))}
          </div>
        </div>

        <Reveal className="mt-12 flex justify-center lg:mt-4">
          <Button to="/book" variant="ivory" arrow>
            Book your experience
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
