import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import { ArrowUpRight, CalendarHeart, MessageCircle, Phone, Sparkles } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import Photo from '../components/media/Photo';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { teamGroups } from '../content/team';
import { booking, site } from '../content/site';
import { ease, floatUp, inViewOnce, stagger } from '../utils/motion';

// Everyone who takes online bookings, each with their own Fresha link (from the current site).
const people = [
  ...teamGroups[0].members.map((p) => ({ ...p, service: 'hair' })),
  ...teamGroups[3].members.filter((p) => p.booking).map((p) => ({ ...p, service: 'hair' })),
  ...teamGroups[1].members.map((p) => ({ ...p, service: 'beauty' })),
];

const filters = [
  { id: 'all', label: 'Everyone' },
  { id: 'hair', label: 'Hair' },
  { id: 'beauty', label: 'Beauty' },
];

function PersonCard({ p }) {
  return (
    <motion.li variants={floatUp} layout transition={{ layout: { duration: 1.2, ease } }}>
      <a href={p.booking} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-4" data-cursor="Book">
        <span className="zoom-frame frame relative block aspect-[4/5] bg-champagne">
          <Photo id={p.photo} sizes="(min-width: 1024px) 23vw, 50vw" className="h-full w-full object-cover object-top" />
          <span className="label absolute inset-x-3 bottom-3 z-10 flex min-h-10 translate-y-2 items-center justify-center gap-2 rounded-full bg-burgundy text-[0.625rem] text-white opacity-0 transition-[opacity,translate] duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" aria-hidden="true">
            Book with {p.name} <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
          </span>
        </span>
        <span className="flex flex-col items-center gap-1 text-center">
          <span>
            <span className="statement block text-h4 text-cherry">{p.name}</span>
            <span className="label mt-1 block text-[0.625rem] text-muted">{p.role}</span>
          </span>
          <span className="label link-line mt-1 inline-flex min-h-11 items-center gap-1 text-[0.625rem] whitespace-nowrap text-burgundy [background-size:100%_1px]">
            Book <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </span>
        <span className="sr-only">Opens {p.name}’s online booking in a new tab</span>
      </a>
    </motion.li>
  );
}

export default function Book() {
  useSeo({
    title: 'Book an Appointment',
    description: 'Book online with your favourite stylist or beauty therapist at Elite Hair & Beauty in Walmer, Gqeberha: live availability and prices for every service.',
    path: '/book',
  });
  const [params, setParams] = useSearchParams();
  const initial = filters.some((f) => f.id === params.get('service')) ? params.get('service') : 'all';
  const [filter, setFilterState] = useState(initial);
  const setFilter = (id) => {
    setFilterState(id);
    setParams(id === 'all' ? {} : { service: id }, { replace: true, preventScrollReset: true });
  };
  const shown = useMemo(() => (filter === 'all' ? people : people.filter((p) => p.service === filter)), [filter]);

  return (
    <>
      <PageHero
        variant="split"
        size="md"
        eyebrow="Online bookings"
        title={['BOOK YOUR', 'eXPERIENCE.']}
        label="Book your experience."
        intro="Choose who you’d like to see and go straight to their online diary, with live availability and current prices."
        photo="salon-reception"
        position="50% 55%"
      />

      {/* First available */}
      <section className="bg-ivory pt-section" aria-labelledby="first-title">
        <div className="shell">
          <Reveal>
            <a
              href={booking.main}
              target="_blank"
              rel="noopener noreferrer"
              className="group grain relative flex flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-frame)] bg-burgundy p-8 text-center text-white transition-colors duration-1000 hover:bg-cherry sm:p-10 md:flex-row md:justify-between md:text-left lg:p-12"
            >
              <span className="flex flex-col items-center gap-5 md:flex-row md:gap-8">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/40">
                  <Sparkles className="size-5" strokeWidth={1.25} aria-hidden="true" />
                </span>
                <span>
                  <span className="label block text-blush">No preference?</span>
                  <span id="first-title" className="statement mt-2 block text-h3">
                    Book with the first available
                  </span>
                  <span className="mt-2 block max-w-[34rem] text-small text-white/80">See every service and every opening across the whole salon.</span>
                </span>
              </span>
              <span className="label inline-flex min-h-[3.25rem] shrink-0 items-center gap-3 rounded-full bg-ivory px-8 text-cherry transition-colors duration-700 group-hover:bg-blush">
                <CalendarHeart className="size-4" strokeWidth={1.25} aria-hidden="true" />
                Book online
                <ArrowUpRight className="size-4 transition-transform duration-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.25} aria-hidden="true" />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Choose your person */}
      <section className="bg-ivory py-section" aria-labelledby="choose-title">
        <div className="shell flex flex-col gap-12">
          <div className="grid grid-cols-1 items-end gap-stack lg:grid-cols-12">
            <SectionHeader
              id="choose-title"
              className="lg:col-span-7"
              eyebrow="Choose your person"
              numeral="01"
              title={[{ text: 'Who would you' }, { text: 'like to see?', className: 'italic text-rose-ink' }]}
              titleClass="statement text-h2 text-cherry"
            >
              Tap a portrait to open their personal booking page.
            </SectionHeader>
            <div className="flex justify-center gap-2 lg:col-span-5 lg:justify-end" role="group" aria-label="Show">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`label relative flex min-h-11 items-center rounded-full px-5 transition-colors duration-700 ${filter === f.id ? 'text-white' : 'text-cherry hover:text-burgundy'}`}
                >
                  {filter === f.id && <motion.span layoutId="book-filter" className="absolute inset-0 -z-10 rounded-full bg-burgundy" transition={{ duration: 0.9, ease }} />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <motion.ul key={filter} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4" variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.01 }}>
            {shown.map((p) => (
              <PersonCard key={p.id} p={p} />
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Other ways */}
      <section className="bg-white py-band" aria-label="Other ways to book">
        <Reveal className="shell grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-frame)] border border-line-light bg-line-light md:grid-cols-3">
          <Link to="/weddings#enquire" className="group flex flex-col items-center gap-3 bg-white p-8 text-center transition-colors duration-1000 hover:bg-ivory md:items-start md:text-left">
            <span className="label text-rose-ink">Planning a wedding?</span>
            <span className="statement text-h4 text-cherry">Send a wedding enquiry</span>
          </Link>
          <a href={`tel:${site.tel}`} className="group flex flex-col items-center gap-3 bg-white p-8 text-center transition-colors duration-1000 hover:bg-ivory md:items-start md:text-left">
            <span className="label flex items-center gap-2 text-rose-ink">
              <Phone className="size-3.5" strokeWidth={1.5} aria-hidden="true" /> Prefer to call?
            </span>
            <span className="statement text-h4 text-cherry">{site.phone}</span>
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 bg-white p-8 text-center transition-colors duration-1000 hover:bg-ivory md:items-start md:text-left">
            <span className="label flex items-center gap-2 text-rose-ink">
              <MessageCircle className="size-3.5" strokeWidth={1.5} aria-hidden="true" /> Questions first?
            </span>
            <span className="statement text-h4 text-cherry">WhatsApp us</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </section>
    </>
  );
}
