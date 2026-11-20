import { useRef } from 'react';
import { motion } from 'motion/react';
import RevealPhoto from '../media/RevealPhoto';
import Parallax from '../motion/Parallax';
import SectionHeader from '../ui/SectionHeader';
import TextLink from '../ui/TextLink';
import Reveal from '../Reveal';
import { brands, site } from '../../content/site';
import { fadeUp, inViewOnce, stagger } from '../../utils/motion';

const facts = [
  { value: String(site.founded), label: 'Established' },
  { value: 'The1054', label: 'Walmer, Gqeberha' },
  { value: 'Hair · Beauty', label: '& Weddings' },
];

// 01 - More than a salon. Editorial split: the welcome on the left, two photographs layered on the right.
export default function BrandIntro() {
  const ref = useRef(null);
  return (
    <section ref={ref} className="overflow-hidden bg-ivory py-section" aria-labelledby="intro-title">
      <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionHeader
            id="intro-title"
            eyebrow="Welcome to Elite"
            numeral="01"
            title={[{ text: 'More than a salon.', break: true }, { text: 'An experience.', className: 'italic text-rose-ink' }]}
            titleClass="statement text-h2 text-cherry"
          >
            A modern salon with passionate staff, dedicated to ensuring your hair is always looking great. Elite Hair &amp; Beauty welcomes you to an
            experience that will keep you coming back.
          </SectionHeader>

          <Reveal className="mt-stack text-center text-muted md:text-left">
            <p className="mx-auto max-w-[36rem] md:mx-0">
              Our team of highly skilled professionals will give you a brand-new look, offer expert advice and make sure you get the absolute best in
              customer satisfaction. From the warm welcome to the personal touch, your visit will be one you remember, not only for how great you look
              when you leave, but for how beautiful you feel.
            </p>
          </Reveal>

          <motion.dl className="mt-12 grid grid-cols-3 border-y border-line-light" variants={stagger(0.15)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
            {facts.map((f, i) => (
              <motion.div key={f.label} variants={fadeUp} className={`flex flex-col-reverse items-center gap-1 px-2 py-6 text-center md:items-start md:text-left ${i ? 'border-l border-line-light md:pl-6' : ''}`}>
                <dt className="label text-[0.625rem] text-muted">{f.label}</dt>
                <dd className="statement text-h4 text-cherry">{f.value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <Reveal className="mt-10 flex justify-center md:justify-start">
            <TextLink to="/about" className="text-burgundy">
              Our story
            </TextLink>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <div className="relative ml-auto w-[82%] lg:w-[78%]">
            <Parallax speed={-30}>
              <RevealPhoto id="salon-lounge" className="aspect-[4/5]" sizes="(min-width: 1024px) 38vw, 82vw" zoom slide="up" position="50% 60%" />
            </Parallax>
          </div>
          <div className="absolute bottom-[-8%] left-0 w-[46%] lg:w-[42%]">
            <Parallax speed={50}>
              <figure>
                <RevealPhoto id="carla-dylan" className="aspect-[3/4] shadow-[0_40px_60px_-30px_rgb(42_23_32/0.4)]" sizes="(min-width: 1024px) 18vw, 46vw" delay={0.3} zoom slide="up" />
                <figcaption className="mt-3 text-[0.8125rem] text-muted">Carla &amp; Dylan, the team behind Elite</figcaption>
              </figure>
            </Parallax>
          </div>
        </div>
      </div>

      {/* The brands on the salon's shelves */}
      <div className="shell mt-section">
        <Reveal className="flex flex-col items-center gap-8 border-t border-line-light pt-12 text-center">
          <p className="label text-rose-ink">The brands we trust, in the chair and on our shelves</p>
          <motion.ul className="flex max-w-5xl flex-wrap items-baseline justify-center gap-x-10 gap-y-4" variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
            {brands.map((b) => (
              <motion.li key={b} variants={fadeUp} className="statement text-h4 text-cherry/80">
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </Reveal>
      </div>
    </section>
  );
}
