import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PageHero from '../components/sections/PageHero';
import FinalCta from '../components/sections/FinalCta';
import RevealPhoto from '../components/media/RevealPhoto';
import SectionHeader from '../components/ui/SectionHeader';
import Eyebrow from '../components/ui/Eyebrow';
import SplitHeading from '../components/ui/SplitHeading';
import Button from '../components/ui/Button';
import TextLink from '../components/ui/TextLink';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { philosophy, storyIntro, timeline } from '../content/story';
import { booking, site } from '../content/site';

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="relative mt-20 lg:mt-28">
      {/* The thread of the story: a hairline that draws down as you read. */}
      <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-line-light lg:block" aria-hidden="true">
        <motion.div className="h-full w-full origin-top bg-rose" style={{ scaleY: draw }} />
      </div>
      <ol className="flex flex-col gap-24 lg:gap-36">
        {timeline.map((t, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={t.year} className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <span className="absolute top-1/2 left-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose bg-ivory lg:block" aria-hidden="true" />
              <div className={`lg:col-span-5 ${flip ? 'lg:col-start-8' : 'lg:col-start-1'} lg:row-start-1`}>
                <RevealPhoto id={t.photo} className={`mx-auto aspect-[4/5] w-full max-w-md ${flip ? 'lg:ml-0' : 'lg:mr-0'}`} sizes="(min-width: 1024px) 34vw, 100vw" zoom position={t.photo === 'team' ? '50% 40%' : undefined} />
              </div>
              <Reveal className={`flex flex-col items-center gap-stack text-center lg:col-span-4 lg:row-start-1 lg:items-start lg:text-left ${flip ? 'lg:col-start-2' : 'lg:col-start-8'}`}>
                <span className="statement text-h2 leading-none text-rose-ink italic">{t.year}</span>
                <h3 className="statement text-h3 text-cherry">{t.title}</h3>
                <p className="max-w-[30rem] text-muted">{t.text}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function About() {
  useSeo({
    title: 'About Elite',
    description: 'Founded by Carla in 2014 as Edge Hair in Humewood, Elite Hair & Beauty moved to The1054 in Walmer, Gqeberha in April 2018. Meet the salon and its story.',
    path: '/about',
  });
  return (
    <>
      <PageHero
        size="md"
        variant="split"
        eyebrow="About Elite · Since 2014"
        title={['BUILT ON PASSION.', 'DEFINED BY eXPERIENCE.']}
        label="Built on passion. Defined by experience."
        intro="A passion project that became one of Walmer’s favourite salons, built by Carla and Dylan with a team that treats every visit as something to remember."
        photo="carla-dylan"
        position="50% 18%"
      />

      <section className="bg-ivory py-section">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <SectionHeader center eyebrow="Where it all began" numeral="01" title={storyIntro} titleClass="statement text-h3 text-cherry md:text-h2" />
          </div>
          <Timeline />
        </div>
      </section>

      {/* Philosophy, set as a pull quote on blush */}
      <section className="bg-blush py-section">
        <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RevealPhoto id="salon-palms" className="mx-auto aspect-[4/5] w-full max-w-md" sizes="(min-width: 1024px) 36vw, 100vw" />
          </div>
          <div className="flex flex-col items-center gap-stack text-center lg:col-span-6 lg:col-start-7 lg:items-start lg:text-left">
            <Eyebrow numeral="02">Our philosophy</Eyebrow>
            <SplitHeading parts={[{ text: 'It’s all about' }, { text: 'you.', className: 'italic text-burgundy' }]} className="statement text-h1 text-cherry" />
            <Reveal className="max-w-[34rem] text-lead text-charcoal/80">{philosophy}</Reveal>
            <Reveal>
              <Button to="/book" arrow>
                Book an appointment
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The team, all together */}
      <section className="bg-white py-section">
        <div className="shell flex flex-col gap-16">
          <div className="grid grid-cols-1 items-end gap-stack lg:grid-cols-12">
            <SectionHeader className="lg:col-span-7" eyebrow="The team" numeral="03" title={[{ text: 'Carla, Dylan' }, { text: '& the Elite family.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
              Today, Carla, Dylan and their dedicated team continue to raise the bar in hair and beauty. They can’t wait to welcome you in and make you feel
              right at home.
            </SectionHeader>
            <Reveal className="flex justify-center gap-8 lg:col-span-5 lg:justify-end">
              <TextLink to="/team" className="text-burgundy">
                Meet the team
              </TextLink>
              <TextLink href={`mailto:${site.careersEmail}?subject=Joining%20the%20Elite%20team`} className="text-burgundy">
                Join our team
              </TextLink>
            </Reveal>
          </div>
          <RevealPhoto id="team" className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/10]" sizes="100vw" position="50% 45%" />
        </div>
      </section>

      <FinalCta photos={['salon-reception', 'ba6-after']} />
    </>
  );
}
