import { Link } from 'react-router';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import Logo from '../brand/Logo';
import Button from '../ui/Button';
import SocialIcon from '../ui/SocialIcon';
import NewsletterForm from '../forms/NewsletterForm';
import { booking, fullAddress, site } from '../../content/site';

const explore = [
  { label: 'About Elite', to: '/about' },
  { label: 'Meet the team', to: '/team' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact & bookings', to: '/contact' },
];
const services = [
  { label: 'Hair', to: '/hair' },
  { label: 'Beauty', to: '/beauty' },
  { label: 'Weddings', to: '/weddings' },
];

function Column({ title, children }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
      <h2 className="label text-blush">{title}</h2>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="grain on-dark bg-cherry text-ivory">
      {/* Booking + newsletter band */}
      <div className="shell grid grid-cols-1 items-end gap-12 border-b border-line-dark py-band lg:grid-cols-12">
        <div className="flex flex-col items-center gap-stack text-center lg:col-span-6 lg:items-start lg:text-left">
          <Logo className="h-14 w-auto md:h-16" />
          <p className="statement max-w-[24ch] text-h3 text-ivory">
            Beauty, <em className="text-blush">elevated</em>. At The1054 in Walmer.
          </p>
          <Button to="/book" variant="ivory" arrow>
            Book your appointment
          </Button>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <NewsletterForm />
        </div>
      </div>

      {/* Details */}
      <div className="shell grid grid-cols-1 gap-12 py-band sm:grid-cols-2 lg:grid-cols-4">
        <Column title="Visit">
          <address className="text-small leading-relaxed text-mist not-italic">
            {site.address.building}
            <br />
            {site.address.street}
            <br />
            {site.address.suburb}, {site.address.city}
          </address>
          <a href={site.directions} target="_blank" rel="noopener noreferrer" className="text-link text-ivory">
            <span className="rule" aria-hidden="true" />
            <span>Get directions</span>
          </a>
        </Column>

        <Column title="Opening hours">
          <dl className="flex w-full max-w-[16rem] flex-col gap-2 text-small">
            {site.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-6">
                <dt className="text-mist">{h.short}</dt>
                <dd className="text-ivory tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
        </Column>

        <Column title="Get in touch">
          <ul className="flex flex-col items-center gap-2 text-small md:items-start">
            <li>
              <a href={`tel:${site.tel}`} className="link-line text-ivory">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="link-line text-ivory">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2 text-ivory">
                <MessageCircle className="size-3.5" strokeWidth={1.5} aria-hidden="true" /> WhatsApp us
              </a>
            </li>
          </ul>
          <div className="flex gap-2">
            {site.socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-full border border-ivory/25 transition-colors duration-700 hover:border-blush hover:bg-blush hover:text-cherry"
                aria-label={`${s.label} ${s.handle} (opens in a new tab)`}
              >
                <SocialIcon id={s.id} className="size-4" />
              </a>
            ))}
          </div>
        </Column>

        <div className="grid grid-cols-2 gap-8">
          <Column title="Explore">
            <ul className="flex flex-col gap-2 text-small">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-line text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Services">
            <ul className="flex flex-col gap-2 text-small">
              {services.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-line text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.careersEmail}?subject=Joining%20the%20Elite%20team`} className="link-line inline-flex items-center gap-1 text-ivory">
                  Join our team <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </Column>
        </div>
      </div>

      <div className="shell flex flex-col items-center justify-between gap-3 border-t border-line-dark pt-8 pb-24 text-center sm:pb-20 text-[0.8125rem] text-mist md:flex-row md:text-left">
        <p>
          © {new Date().getFullYear()} {site.name} · {fullAddress}
        </p>
        <p className="flex gap-6">
          <Link to="/privacy" className="link-line">
            Privacy
          </Link>
          <span>Est. {site.founded}</span>
        </p>
      </div>
    </footer>
  );
}
