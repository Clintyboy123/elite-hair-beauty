import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import FinalCta from '../components/sections/FinalCta';
import Transformations from '../components/sections/Transformations';
import RevealPhoto from '../components/media/RevealPhoto';
import Parallax from '../components/motion/Parallax';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import TextLink from '../components/ui/TextLink';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { hairIntro, hairServices } from '../content/services';
import { stylists } from '../content/team';
import { booking } from '../content/site';

export default function Hair() {
  useSeo({
    title: 'Hair',
    description:
      'Hair at Elite Hair & Beauty, Walmer, Gqeberha: ladies’ and men’s cutting, blow-drying, foils, tints, balayage, Brazilian Blowout and hair treatments, and wedding hair packages. Book online.',
    path: '/hair',
  });
  return (
    <>
      <PageHero variant="full" eyebrow="Our services · Hair" title={['HAIR']} label="Hair" intro="Bringing out your best self." photo="colour-waves" position="50% 35%">
        <Button to="/book?service=hair" variant="ivory" arrow className="w-full sm:w-auto">
          Book a hair appointment
        </Button>
        <TextLink href="#services" className="text-ivory">
          Explore hair services
        </TextLink>
      </PageHero>

      {/* Intro */}
      <section className="bg-ivory py-section">
        <div className="shell grid grid-cols-1 gap-stack lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="Hair at Elite" numeral="01" title={[{ text: 'Great hair, and the way' }, { text: 'it makes you feel.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry" />
          </div>
          <Reveal className="flex flex-col items-center gap-stack text-center lg:col-span-4 lg:col-start-9 lg:items-start lg:self-end lg:text-left">
            <p className="text-muted">{hairIntro}</p>
            <p className="text-small text-muted">
              Current prices for every hair service are listed on our online booking page.{' '}
              <a href={booking.hair} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-1 text-burgundy [background-size:100%_1px]">
                View prices <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services: large photographic rows, alternating sides */}
      <section id="services" className="scroll-mt-20 bg-ivory pb-section" aria-label="Hair services">
        <ol className="shell flex flex-col gap-24 lg:gap-40">
          {hairServices.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.id} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
                <div className={`relative lg:col-span-6 ${flip ? 'lg:col-start-7' : ''} lg:row-start-1`}>
                  <Parallax speed={-25}>
                    <RevealPhoto id={s.photo} className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]" sizes="(min-width: 1024px) 48vw, 100vw" zoom />
                  </Parallax>
                  <span className={`statement pointer-events-none absolute -bottom-10 text-[clamp(5rem,12vw,10rem)] leading-none text-rose/25 italic ${flip ? 'left-4 lg:-left-10' : 'right-4 lg:-right-10'}`} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <Reveal className={`flex flex-col items-center gap-stack text-center lg:col-span-4 lg:row-start-1 lg:items-start lg:text-left ${flip ? 'lg:col-start-2' : 'lg:col-start-8'}`}>
                  <p className="label text-rose-ink">{String(i + 1).padStart(2, '0')} / {String(hairServices.length).padStart(2, '0')}</p>
                  <h2 className="statement text-h2 text-cherry">{s.title}</h2>
                  <p className="max-w-[28rem] text-muted">{s.text}</p>
                  <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
                    {s.items.map((item) => (
                      <li key={item} className="rounded-full border border-cherry/15 px-4 py-1.5 text-small text-charcoal">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.to ? (
                    <Button to={s.to} variant="outline" arrow>
                      Wedding packages
                    </Button>
                  ) : (
                    <Button to="/book?service=hair" variant="outline" arrow>
                      Book now
                    </Button>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <Transformations numeral="02" />

      {/* Book with a stylist */}
      <section className="bg-white py-band">
        <div className="shell flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <SectionHeader eyebrow="Book with your stylist" numeral="03" title="Choose who does your hair." titleClass="statement text-h3 text-cherry" />
          <Reveal as="ul" className="flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-2 lg:justify-end">
            {stylists.map((p) => (
              <li key={p.id}>
                <a href={p.booking} target="_blank" rel="noopener noreferrer" className="statement link-line inline-flex min-h-11 items-center text-h4 text-cherry hover:text-burgundy">
                  {p.name}
                  <span className="sr-only"> – book online (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <Link to="/team" className="label link-line inline-flex min-h-11 items-center text-rose-ink">
                Meet the team
              </Link>
            </li>
          </Reveal>
        </div>
      </section>

      <FinalCta photos={['ba5-after', 'blowdry-at-elite']} />
    </>
  );
}
