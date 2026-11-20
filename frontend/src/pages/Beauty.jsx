import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import PageHero from '../components/sections/PageHero';
import FinalCta from '../components/sections/FinalCta';
import RevealPhoto from '../components/media/RevealPhoto';
import Photo from '../components/media/Photo';
import Parallax from '../components/motion/Parallax';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import TextLink from '../components/ui/TextLink';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { beautyCategories, beautyIntro } from '../content/services';
import { teamGroups } from '../content/team';
import { fadeUp, floatUp, inViewOnce, stagger } from '../utils/motion';

const therapists = teamGroups[1].members;
const diaries = { ilahm: 'Nails & Beauty by Ilahm', megan: 'Elegance Health & Beauty' };

// Category tabs that stay in view while you read, and show which category you are in.
function CategoryNav() {
  const [current, setCurrent] = useState(beautyCategories[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    beautyCategories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav aria-label="Beauty categories" className="sticky top-0 z-30 border-y border-line-light bg-ivory/90 backdrop-blur-md">
      <ul className="shell no-scrollbar flex justify-center gap-2 overflow-x-auto py-3 sm:gap-4">
        {beautyCategories.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={current === c.id ? 'true' : undefined}
              className={`label flex min-h-11 items-center gap-3 rounded-full px-5 whitespace-nowrap transition-colors duration-700 ${current === c.id ? 'bg-burgundy text-white' : 'text-cherry hover:text-burgundy'}`}
            >
              <span className="statement text-[1rem] font-normal tracking-normal normal-case italic">{c.numeral}</span>
              {c.title}
            </a>
          </li>
        ))}
        <li>
          <a href="#book" className="label flex min-h-11 items-center rounded-full px-5 whitespace-nowrap text-rose-ink transition-colors duration-700 hover:text-burgundy">
            Book
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default function Beauty() {
  useSeo({
    title: 'Beauty',
    description:
      'Beauty at Elite Hair & Beauty, Walmer, Gqeberha: manicures, pedicures, gel and acrylic nails, nail art, lashes, tinting, facials, waxing, massage and make-up. Book online with our beauty therapists.',
    path: '/beauty',
  });
  return (
    <>
      <PageHero
        size="md"
        variant="split"
        eyebrow="Our services · Beauty"
        title={['BEAUTY IN', 'eVERY DETAIL.']}
        label="Beauty in every detail."
        intro={beautyIntro}
        photo="lashes"
        position="45% 40%"
      >
        <Button href="#book" variant="ivory" arrow className="w-full sm:w-auto">
          Book a treatment
        </Button>
      </PageHero>

      <CategoryNav />

      {beautyCategories.map((c, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={c.id} id={c.id} className={`scroll-mt-16 py-section ${flip ? 'bg-white' : 'bg-ivory'}`} aria-labelledby={`${c.id}-title`}>
            <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
              <div className={`relative lg:col-span-6 lg:row-start-1 ${flip ? 'lg:col-start-7' : ''}`}>
                <div className={`w-[82%] ${flip ? 'ml-auto' : ''}`}>
                  <RevealPhoto id={c.photo} className="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 82vw" zoom />
                </div>
                <div className={`absolute bottom-[-10%] w-[44%] ${flip ? 'left-0' : 'right-0'}`}>
                  <Parallax speed={45}>
                    <RevealPhoto id={c.secondary} className="aspect-[3/4] shadow-[0_40px_60px_-30px_rgb(42_23_32/0.4)]" sizes="(min-width: 1024px) 20vw, 44vw" delay={0.4} />
                  </Parallax>
                </div>
              </div>
              <div className={`mt-10 flex flex-col gap-stack lg:col-span-5 lg:row-start-1 lg:mt-0 ${flip ? 'lg:col-start-1' : 'lg:col-start-8'}`}>
                <SectionHeader id={`${c.id}-title`} eyebrow="Beauty treatments" numeral={c.numeral} title={c.title} titleClass="statement text-h1 text-cherry">
                  {c.text}
                </SectionHeader>
                <motion.ul className="border-t border-line-light" variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
                  {c.items.map((item, n) => (
                    <motion.li key={item} variants={fadeUp} className="flex items-baseline justify-between gap-6 border-b border-line-light py-4">
                      <span className="statement text-h4 text-cherry">{item}</span>
                      <span className="label text-[0.625rem] text-muted tabular-nums">{String(n + 1).padStart(2, '0')}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </section>
        );
      })}

      {/* Booking: each therapist keeps her own diary on Fresha */}
      <section id="book" className="grain on-dark scroll-mt-16 bg-cherry py-section text-ivory" aria-labelledby="book-title">
        <div className="shell flex flex-col gap-16">
          <div className="mx-auto max-w-3xl">
            <SectionHeader id="book-title" center tone="dark" eyebrow="Book a treatment" numeral="04" title={[{ text: 'Book with our' }, { text: 'beauty team.', className: 'italic text-blush' }]} titleClass="statement text-h2 text-ivory">
              Our beauty therapists each keep their own online diary, with live availability and current prices for every treatment.
            </SectionHeader>
          </div>
          <motion.ul className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2" variants={stagger(0.18)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
            {therapists.map((t) => (
              <motion.li key={t.id} variants={floatUp} className="group grid grid-cols-5 items-center gap-6 border border-line-dark p-4 sm:p-5">
                <div className="zoom-frame frame relative col-span-2 aspect-[4/5]">
                  <Photo id={t.photo} sizes="(min-width: 768px) 16vw, 36vw" className="h-full w-full object-cover object-top" />
                </div>
                <div className="col-span-3 flex flex-col items-start gap-3">
                  <p className="label text-blush">{t.role}</p>
                  <h3 className="statement text-h3 text-ivory">{t.name}</h3>
                  <p className="text-small text-mist">{diaries[t.id]}</p>
                  <Button href={t.booking} variant="ivory" size="sm" arrow className="mt-2" aria-label={`Book with ${t.name} (opens in a new tab)`}>
                    Book now
                  </Button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <Reveal className="flex justify-center">
            <TextLink to="/contact" className="text-ivory">
              Not sure who to book? Ask us
            </TextLink>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title={[{ text: 'Time to feel your' }, { text: 'absolute best?', className: 'italic text-blush' }]}
        text="Whether it’s a speedy tint or a full pampering session, our expert team is here to take care of you, head to toe."
        photos={['nails-at-elite', 'nail-bar']}
      />
    </>
  );
}
