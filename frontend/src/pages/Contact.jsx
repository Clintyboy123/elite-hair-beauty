import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowUpRight, CalendarHeart, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import TextLink from '../components/ui/TextLink';
import Reveal from '../components/Reveal';
import ContactForm from '../components/forms/ContactForm';
import useSeo from '../hooks/useSeo';
import { booking, fullAddress, site } from '../content/site';
import { fadeUp, inViewOnce, stagger } from '../utils/motion';

// Is the salon open right now (South African time)? Public holidays aren't known here, so they're not claimed.
function useOpenNow() {
  const [state, setState] = useState(null);
  useEffect(() => {
    const check = () => {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      const today = site.hours.find((h) => h.open?.includes(day));
      setState(today && hour >= today.from && hour < today.to ? { open: true, until: today.time.split('–')[1].trim() } : { open: false });
    };
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, []);
  return state;
}

const ways = [
  { id: 'book', icon: CalendarHeart, title: 'Book online', text: 'Live availability for every stylist and treatment.', href: '/book', cta: 'Choose your stylist', primary: true },
  { id: 'call', icon: Phone, title: 'Call us', text: site.phone, href: `tel:${site.tel}`, cta: 'Call the salon' },
  { id: 'whatsapp', icon: MessageCircle, title: 'WhatsApp', text: 'Send us a message on WhatsApp.', href: site.whatsapp, cta: 'Start a chat' },
  { id: 'email', icon: Mail, title: 'Email', text: site.email, href: `mailto:${site.email}`, cta: 'Write to us' },
];

export default function Contact() {
  useSeo({
    title: 'Contact & Bookings',
    description: 'Book online, call 041 581 0090, WhatsApp or email Elite Hair & Beauty at The1054, 254 Main Road, Walmer, Gqeberha. Opening hours, directions and map.',
    path: '/contact',
  });
  const status = useOpenNow();

  return (
    <>
      <PageHero
        variant="split"
        eyebrow="Contact & bookings"
        title={['GET IN', 'TOUCH.']}
        label="Get in touch."
        intro="Book online, call or WhatsApp us. We can’t wait to welcome you in."
        photo="salon-exterior"
        position="40% 50%"
      >
        <Button to="/book" variant="ivory" arrow className="w-full sm:w-auto">
          Book online now
        </Button>
        <TextLink href={`tel:${site.tel}`} className="text-ivory">
          {site.phone}
        </TextLink>
      </PageHero>

      {/* Four ways to reach us */}
      <section className="bg-ivory py-section" aria-label="Ways to book and contact us">
        <div className="shell">
        <motion.ul className="grid grid-cols-1 gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4" variants={stagger(0.12)} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          {ways.map((w) => {
            const external = /^https?:/.test(w.href);
            const Icon = w.icon;
            const Tile = w.href.startsWith('/') ? Link : 'a'; // site pages stay in the app (the music keeps playing)
            return (
              <motion.li key={w.id} variants={fadeUp} className={w.primary ? 'bg-burgundy text-white' : 'bg-ivory'}>
                <Tile
                  {...(w.href.startsWith('/') ? { to: w.href } : { href: w.href })}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`group flex h-full flex-col items-center gap-5 p-8 text-center transition-colors duration-1000 sm:items-start sm:text-left lg:p-10 ${w.primary ? 'hover:bg-cherry' : 'hover:bg-white'}`}
                >
                  <span className={`flex size-12 items-center justify-center rounded-full border ${w.primary ? 'border-white/40' : 'border-rose/40 text-rose-ink'}`}>
                    <Icon className="size-5" strokeWidth={1.25} aria-hidden="true" />
                  </span>
                  <span className={`statement text-h3 ${w.primary ? 'text-white' : 'text-cherry'}`}>{w.title}</span>
                  <span className={`text-small ${w.primary ? 'text-white/80' : 'text-muted'}`}>{w.text}</span>
                  <span className={`label mt-auto inline-flex items-center gap-2 pt-2 ${w.primary ? 'text-white' : 'text-burgundy'}`}>
                    {w.cta}
                    <ArrowUpRight className="size-3.5 transition-transform duration-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </Tile>
              </motion.li>
            );
          })}
        </motion.ul>
        </div>
        <Reveal className="shell mt-8 text-center text-small text-muted">
          Beauty treatments are booked directly with{' '}
          <a href={booking.ilahm} target="_blank" rel="noopener noreferrer" className="link-line text-burgundy [background-size:100%_1px]">
            Ilahm
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          or{' '}
          <a href={booking.megan} target="_blank" rel="noopener noreferrer" className="link-line text-burgundy [background-size:100%_1px]">
            Megan
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </Reveal>
      </section>

      {/* Visit */}
      <section className="grain on-dark bg-cherry text-ivory" aria-labelledby="visit-title">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="shell flex flex-col gap-12 py-section lg:pr-16">
            <SectionHeader id="visit-title" tone="dark" eyebrow="Visit the salon" numeral="01" title={[{ text: 'Find us at' }, { text: 'The1054.', className: 'italic text-blush' }]} titleClass="statement text-h2 text-ivory" />
            <Reveal className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                <h3 className="label text-blush">Address</h3>
                <address className="text-ivory/85 not-italic">
                  {site.address.building}
                  <br />
                  {site.address.street}
                  <br />
                  {site.address.suburb}, {site.address.city}
                </address>
                <TextLink href={site.directions} className="text-ivory">
                  Get directions
                </TextLink>
              </div>
              <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                <h3 className="label flex items-center gap-3 text-blush">
                  Opening hours
                  {status && (
                    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.5625rem] ${status.open ? 'bg-ivory/10 text-ivory' : 'bg-ivory/5 text-mist'}`}>
                      <span className={`size-1.5 rounded-full ${status.open ? 'bg-[#9fc29a]' : 'bg-mist'}`} aria-hidden="true" />
                      {status.open ? `Open now · until ${status.until}` : 'Closed now'}
                    </span>
                  )}
                </h3>
                <dl className="flex w-full max-w-[18rem] flex-col gap-2">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-6 border-b border-line-dark pb-2">
                      <dt className="text-mist">{h.days}</dt>
                      <dd className="text-ivory tabular-nums">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
          <div className="relative min-h-[26rem] lg:min-h-full">
            <iframe
              title={`Map: ${site.name}, ${fullAddress}`}
              src={site.mapEmbed}
              className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={site.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="label absolute bottom-4 left-4 flex min-h-11 items-center gap-2 rounded-full bg-cherry px-5 text-ivory shadow-lg transition-colors duration-700 hover:bg-burgundy"
            >
              <MapPin className="size-4" strokeWidth={1.25} aria-hidden="true" /> Open in Google Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Message */}
      <section id="form" className="scroll-mt-16 bg-white py-section" aria-labelledby="form-title">
        <div className="shell grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="form-title" eyebrow="Send a message" numeral="02" title={[{ text: 'Questions?' }, { text: 'We’d love to help.', className: 'italic text-rose-ink' }]} titleClass="statement text-h2 text-cherry">
              Ask about a service, a product or an online order, and we’ll get back to you.
            </SectionHeader>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
