import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import RevealPhoto from '../components/media/RevealPhoto';
import Parallax from '../components/motion/Parallax';
import SectionHeader from '../components/ui/SectionHeader';
import SplitHeading from '../components/ui/SplitHeading';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import Reveal from '../components/Reveal';
import WeddingForm from '../components/forms/WeddingForm';
import useSeo from '../hooks/useSeo';
import { weddingIntro, weddingServices } from '../content/services';
import { site } from '../content/site';
import { fadeUp, floatUp, inViewOnce, stagger } from '../utils/motion';

const steps = [
  { title: 'Tell us about your day', text: 'Send us your date, where you’re getting ready and who needs hair and make-up.' },
  { title: 'We plan it with you', text: 'We’ll be in touch to talk through your look, your bridal party and your timings.' },
  { title: 'We come to you', text: 'On the morning, our team arrives with everything needed, so you can relax and enjoy the moment.' },
];

const mood = [
  { id: 'bridal-braid' },
  { id: 'bridal-laughing' },
  { id: 'bridal-makeup' },
  { id: 'bridal-updo' },
];

export default function Weddings() {
  useSeo({
    title: 'Weddings',
    description:
      'Bridal hair, wedding make-up and beauty treatments for you and your bridal party, from Elite Hair & Beauty in Walmer, Gqeberha. We come to you. Send a wedding enquiry.',
    path: '/weddings',
  });
  return (
    <>
      <PageHero
        size="md"
        variant="light"
        eyebrow="Weddings"
        title={['YOUR DREAM DAY,', 'OUR eXPERT TOUCH.']}
        label="Your dream day, our expert touch."
        intro="Bridal hair, make-up and beauty for you and everyone getting ready with you."
        photo="bridal-veil"
        secondPhoto="bridal-chignon"
        position="50% 30%"
      >
        <Button href="#enquire" arrow className="w-full sm:w-auto">
          Make a wedding enquiry
        </Button>
      </PageHero>

      {/* The promise, as one statement */}
      <section className="bg-white py-section">
        <div className="shell mx-auto flex max-w-5xl flex-col items-center gap-stack text-center">
          <Eyebrow numeral="01" center>
            Effortlessly beautiful
          </Eyebrow>
          <SplitHeading as="p" parts={weddingIntro} className="statement text-h3 text-cherry md:text-[clamp(2rem,1.4rem+1.6vw,3rem)] md:leading-[1.2]" gap={0.02} />
        </div>
      </section>

      {/* What we do */}
      <section className="bg-ivory py-section" aria-labelledby="bridal-services">
        <div className="shell grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeader id="bridal-services" eyebrow="For you & your party" numeral="02" title={[{ text: 'Everything for' }, { text: 'the morning of.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
              From hair and make-up to beauty treatments, we’ll come to you and ensure every detail is perfect.
            </SectionHeader>
            <div className="mt-12 hidden w-3/4 lg:block">
              <RevealPhoto id="bridal-vine" className="aspect-[4/5]" sizes="28vw" />
            </div>
          </div>
          <motion.ol className="grid grid-cols-1 gap-px bg-line-light sm:grid-cols-2 lg:col-span-6 lg:col-start-7" variants={stagger(0.15)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
            {weddingServices.map((s, i) => (
              <motion.li key={s.id} variants={fadeUp} className="flex flex-col items-center gap-4 bg-ivory p-8 text-center sm:items-start sm:text-left lg:p-10">
                <span className="statement text-h3 text-rose italic">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="statement text-h3 text-cherry">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* We come to you */}
      <section className="relative overflow-hidden bg-blush py-section">
        <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Parallax speed={-30}>
              <RevealPhoto id="bridal-ready" className="aspect-[4/3]" sizes="(min-width: 1024px) 48vw, 100vw" />
            </Parallax>
          </div>
          <div className="flex flex-col items-center gap-stack text-center lg:col-span-5 lg:col-start-8 lg:items-start lg:text-left">
            <Eyebrow numeral="03">On the day</Eyebrow>
            <SplitHeading parts={[{ text: 'We’ll come' }, { text: 'to you.', className: 'italic text-burgundy' }]} className="statement text-h1 text-cherry" />
            <Reveal className="max-w-[30rem] text-lead text-charcoal/80">
              Relax, enjoy the moment, and let us help you create memories that last a lifetime. Wherever you’re getting ready, we bring the salon to you.
            </Reveal>
            <Reveal as="ol" className="mt-4 flex w-full flex-col border-t border-cherry/15 text-left">
              {steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-cherry/15 py-5">
                  <span className="statement text-h4 text-burgundy italic tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="statement block text-h4 text-cherry">{s.title}</span>
                    <span className="mt-1 block text-small text-charcoal/75">{s.text}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mood */}
      <section className="bg-white py-band" aria-label="Bridal inspiration">
        <motion.ul className="shell grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" variants={stagger(0.15)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          {mood.map((m, i) => (
            <motion.li key={m.id} className={i % 2 ? 'lg:mt-16' : ''}>
              <RevealPhoto id={m.id} className="w-full" sizes="(min-width: 1024px) 24vw, 50vw" zoom position="50% 35%" />
            </motion.li>
          ))}
        </motion.ul>
        <p className="shell mt-6 text-center text-[0.75rem] text-muted">Inspiration imagery. Ask us for photos of our own bridal work.</p>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-16 bg-ivory py-section" aria-labelledby="enquire-title">
        <div className="shell grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="flex flex-col gap-stack lg:col-span-4">
            <SectionHeader id="enquire-title" eyebrow="Wedding enquiries" numeral="04" title={[{ text: 'Let’s plan' }, { text: 'your look.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
              Tell us a little about your day and we’ll be in touch. Prefer to chat? Call or email us.
            </SectionHeader>
            <Reveal className="flex flex-col items-center gap-3 lg:items-start">
              <a href={`tel:${site.tel}`} className="link-line inline-flex min-h-11 items-center gap-3 text-cherry">
                <Phone className="size-4 text-rose" strokeWidth={1.25} aria-hidden="true" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}?subject=Wedding%20enquiry`} className="link-line inline-flex min-h-11 items-center gap-3 text-cherry">
                <Mail className="size-4 text-rose" strokeWidth={1.25} aria-hidden="true" /> {site.email}
              </a>
            </Reveal>
          </div>
          <Reveal className="bg-white p-6 shadow-[0_40px_80px_-50px_rgb(53_29_39/0.35)] sm:p-10 lg:col-span-7 lg:col-start-6 lg:p-14">
            <WeddingForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
