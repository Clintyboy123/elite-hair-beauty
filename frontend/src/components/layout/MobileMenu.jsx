import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavLink } from 'react-router';
import { MessageCircle, Phone, X } from 'lucide-react';
import Logo from '../brand/Logo';
import Button from '../ui/Button';
import SocialIcon from '../ui/SocialIcon';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import { booking, site } from '../../content/site';
import { ease } from '../../utils/motion';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Hair', to: '/hair' },
  { label: 'Beauty', to: '/beauty' },
  { label: 'Weddings', to: '/weddings' },
  { label: 'Team', to: '/team' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Shop', to: '/shop' },
  { label: 'Book', to: '/book' },
  { label: 'Contact', to: '/contact' },
];

// Full-screen menu for phones and tablets: a cherry panel rises, links arrive one after another.
export default function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-cherry text-ivory lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.1, ease } }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.8, ease } }}
        >
          <div className="shell flex h-20 shrink-0 items-center justify-between">
            <Logo className="h-9 w-auto" />
            <button type="button" onClick={onClose} className="-mr-2 flex size-12 items-center justify-center" aria-label="Close menu">
              <X className="size-6" strokeWidth={1} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center py-8">
            <motion.ul className="flex flex-col items-center gap-1 text-center" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}>
              {links.map((link) => (
                <li key={link.to} className="overflow-hidden">
                  <motion.span className="block" variants={{ hidden: { y: '110%' }, visible: { y: '0%', transition: { duration: 1.2, ease } } }}>
                    <NavLink
                      to={link.to}
                      end
                      onClick={onClose}
                      className={({ isActive }) => `statement block py-1.5 text-[clamp(2rem,8vw,3rem)] leading-tight transition-colors duration-700 ${isActive ? 'text-blush italic' : 'text-ivory hover:text-blush'}`}
                    >
                      {link.label}
                    </NavLink>
                  </motion.span>
                </li>
              ))}
            </motion.ul>
          </nav>

          <motion.div
            className="shell flex shrink-0 flex-col items-center gap-6 pb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease, delay: 0.6 } }}
          >
            <Button to="/book" variant="ivory" arrow className="w-full max-w-sm" onClick={onClose}>
              Book your appointment
            </Button>
            <div className="flex items-center gap-2">
              <a href={`tel:${site.tel}`} className="flex size-12 items-center justify-center rounded-full border border-ivory/25" aria-label={`Call ${site.phone}`}>
                <Phone className="size-4" strokeWidth={1.25} aria-hidden="true" />
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full border border-ivory/25" aria-label="WhatsApp us (opens in a new tab)">
                <MessageCircle className="size-4" strokeWidth={1.25} aria-hidden="true" />
              </a>
              {site.socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full border border-ivory/25" aria-label={`${s.label} (opens in a new tab)`}>
                  <SocialIcon id={s.id} className="size-4" />
                </a>
              ))}
            </div>
            <p className="label text-mist">Mon – Fri 8 – 5 · Sat 8 – 2</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
