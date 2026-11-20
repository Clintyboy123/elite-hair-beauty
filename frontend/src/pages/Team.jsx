import { motion } from 'motion/react';
import PageHero from '../components/sections/PageHero';
import FinalCta from '../components/sections/FinalCta';
import Photo from '../components/media/Photo';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { teamGroups } from '../content/team';
import { booking, site } from '../content/site';
import { floatUp, inViewOnce, stagger } from '../utils/motion';

function Member({ p, feature = false }) {
  return (
    <motion.li variants={floatUp} className={feature ? 'sm:col-span-2 sm:row-span-2' : ''}>
      <figure className="group flex h-full flex-col gap-4">
        <div className={`zoom-frame frame relative w-full flex-1 bg-champagne ${feature ? 'aspect-[4/5] sm:aspect-auto sm:min-h-[36rem]' : 'aspect-[4/5]'}`}>
          <div className="absolute inset-0">
            <Photo id={p.photo} sizes={feature ? '(min-width: 1024px) 46vw, 100vw' : '(min-width: 1024px) 23vw, 50vw'} className="h-full w-full object-cover object-top" />
          </div>
          {feature && <span className="label absolute top-4 left-4 rounded-full bg-cherry/75 px-3 py-1.5 text-[0.5625rem] text-ivory backdrop-blur-sm">Owner</span>}
        </div>
        <figcaption className="flex flex-col items-center gap-1 text-center">
          <span>
            <span className={`statement block text-cherry ${feature ? 'text-h2' : 'text-h4'}`}>{p.name}</span>
            <span className="label mt-1 block text-[0.625rem] text-muted">{p.role}</span>
            {p.bio && <span className="mx-auto mt-2 block max-w-[30rem] text-small text-muted">{p.bio}</span>}
          </span>
          {p.booking && (
            <a href={p.booking} target="_blank" rel="noopener noreferrer" className="label link-line mt-1 inline-flex min-h-11 items-center text-[0.625rem] whitespace-nowrap text-burgundy">
              Book with {p.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </figcaption>
      </figure>
    </motion.li>
  );
}

export default function Team() {
  useSeo({
    title: 'Meet the Team',
    description: 'Meet the stylists, beauty therapists and salon team at Elite Hair & Beauty in Walmer, Gqeberha, and book online with the person you love.',
    path: '/team',
  });
  return (
    <>
      <PageHero variant="full" eyebrow="The people of Elite" title={['MEET THE', 'TEAM.']} label="Meet the team." intro="Stylists, beauty therapists and a salon team who love what they do." photo="team" position="50% 38%">
        <Button to="/book" variant="ivory" arrow className="w-full sm:w-auto">
          Book online
        </Button>
      </PageHero>

      {teamGroups.map((g, gi) => (
        <section key={g.id} className={`py-section ${gi % 2 ? 'bg-white' : 'bg-ivory'}`} aria-labelledby={`${g.id}-title`}>
          <div className="shell flex flex-col gap-14">
            <SectionHeader id={`${g.id}-title`} eyebrow={`${g.members.length} ${g.members.length === 1 ? 'person' : 'people'}`} numeral={String(gi + 1).padStart(2, '0')} title={g.title} titleClass="statement text-h2 text-cherry" />
            <motion.ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4" variants={stagger(0.12)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
              {g.members.map((p, i) => (
                <Member key={p.id} p={p} feature={g.id === 'stylists' && i === 0} />
              ))}
            </motion.ul>
          </div>
        </section>
      ))}

      {/* Join */}
      <section className="bg-champagne py-band">
        <Reveal className="shell flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="flex flex-col gap-3">
            <p className="label text-rose-ink">Join our team</p>
            <p className="statement max-w-[30ch] text-h3 text-cherry">Passionate about hair and beauty? We’d love to hear from you.</p>
          </div>
          <Button href={`mailto:${site.careersEmail}?subject=Joining%20the%20Elite%20team`} variant="outline" arrow>
            Email Dylan
          </Button>
        </Reveal>
      </section>

      <FinalCta photos={['ba9-after', 'salon-working']} />
    </>
  );
}
