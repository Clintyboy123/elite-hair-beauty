import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Link, NavLink, useLocation } from 'react-router';
import { ChevronDown, Phone } from 'lucide-react';
import Logo from '../brand/Logo';
import Button from '../ui/Button';
import Photo from '../media/Photo';
import MobileMenu from './MobileMenu';
import { booking, nav, site } from '../../content/site';
import { ease } from '../../utils/motion';

// Pages whose top section is light, so the transparent header uses dark text there.
const LIGHT_TOPS = ['/weddings', '/shop', '/gallery', '/privacy'];

export default function Header() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const closeTimer = useRef(null);

  // Solid once the page moves; hides while scrolling down, returns as soon as you scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    if (menuOpen || dropdown) return;
    setHidden(y > 480 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  useEffect(() => {
    setMenuOpen(false);
    setDropdown(false);
    setHidden(false);
  }, [pathname]);

  const lightTop = LIGHT_TOPS.includes(pathname) && !solid;
  const text = lightTop ? 'text-cherry' : 'text-ivory';

  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 180);
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 ${text}`}
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 1, ease }}
      >
        <div
          className={`absolute inset-0 -z-10 transition-[background-color,backdrop-filter,box-shadow] duration-1000 ${
            solid ? 'bg-cherry/92 shadow-[0_1px_0_rgb(242_233_227/0.08)] backdrop-blur-md' : 'bg-transparent'
          }`}
          aria-hidden="true"
        />
        <div className={`shell flex items-center justify-between gap-6 transition-[height] duration-1000 ${solid ? 'h-[4.5rem]' : 'h-20 lg:h-24'}`}>
          <Link to="/" className="relative z-10 -my-2 py-2 transition-opacity duration-700 hover:opacity-80" aria-label="Elite Hair & Beauty, home">
            <Logo className="h-9 w-auto lg:h-10" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9 xl:gap-11">
              {nav.map((item) =>
                item.children ? (
                  <li key={item.label} className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                    <button
                      type="button"
                      className={`label link-line flex min-h-11 items-center gap-2 ${['/hair', '/beauty', '/weddings'].includes(pathname) ? '[background-size:100%_1px]' : ''}`}
                      aria-expanded={dropdown}
                      aria-controls="services-menu"
                      onClick={() => setDropdown((d) => !d)}
                      onFocus={openDropdown}
                    >
                      {item.label}
                      <ChevronDown className={`size-3.5 transition-transform duration-700 ${dropdown ? 'rotate-180' : ''}`} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <AnimatePresence>
                      {dropdown && (
                        <motion.div
                          id="services-menu"
                          className="absolute top-full left-1/2 w-[38rem] -translate-x-1/2 pt-5"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease } }}
                          exit={{ opacity: 0, y: 8, transition: { duration: 0.5, ease } }}
                          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setDropdown(false)}
                        >
                          <ul className="grid grid-cols-3 gap-3 bg-cherry p-3 text-ivory shadow-[0_30px_60px_-30px_rgb(20_8_14/0.7)]">
                            {item.children.map((child) => (
                              <li key={child.to}>
                                <Link to={child.to} className="group flex flex-col gap-3 p-1 pb-3" onClick={() => setDropdown(false)}>
                                  <span className="zoom-frame frame relative block aspect-[4/5]">
                                    <Photo id={child.photo} sizes="12rem" className="h-full w-full object-cover" />
                                  </span>
                                  <span className="statement px-1 text-h4 text-ivory">{child.label}</span>
                                  <span className="px-1 text-small text-mist">{child.note}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink to={item.to} className="label link-line flex min-h-11 items-center">
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3 lg:gap-6">
            <a href={`tel:${site.tel}`} className="label link-line hidden min-h-11 items-center gap-2 xl:flex" aria-label={`Call ${site.phone}`}>
              <Phone className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              {site.phone}
            </a>
            <Button to="/book" variant={lightTop ? 'burgundy' : 'ivory'} size="sm" className="hidden sm:inline-flex">
              Book now
            </Button>
            <button
              type="button"
              className="relative z-10 -mr-2 flex size-12 items-center justify-center lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="flex w-7 flex-col items-end gap-[7px]" aria-hidden="true">
                <span className="block h-px w-7 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
