import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Photo from '../media/Photo';
import SectionHeader from '../ui/SectionHeader';
import { floatUp, inViewOnce, stagger } from '../../utils/motion';

const services = [
  {
    id: 'hair',
    numeral: '01',
    title: 'Hair',
    photo: 'editorial-blonde',
    position: '50% 25%',
    text: 'Ladies’ and men’s cutting, blow-drying, foils, tints, balayage, Brazilian Blowout treatments and wedding packages.',
    to: '/hair',
  },
  {
    id: 'beauty',
    numeral: '02',
    title: 'Beauty',
    photo: 'lashes',
    position: '45% 40%',
    text: 'Manicures, pedicures, gel and acrylic nails, nail art, tinting, waxing, facials, lashes, massage and make-up.',
    to: '/beauty',
  },
  {
    id: 'weddings',
    numeral: '03',
    title: 'Weddings',
    photo: 'bridal-vine',
    position: '50% 30%',
    text: 'Bridal hair, make-up and beauty treatments for you and your party. We’ll come to you and take care of every detail.',
    to: '/weddings',
  },
];

// 02 - Three tall panels; on desktop the one you point at opens up to tell its story.
export default function ServicesTriptych() {
  const [active, setActive] = useState(0);
  return (
    <section className="no-focus-blur bg-white py-section" aria-labelledby="services-title">
      <div className="shell flex flex-col gap-16">
        <div className="grid grid-cols-1 items-end gap-stack lg:grid-cols-12">
          <SectionHeader id="services-title" className="lg:col-span-7" eyebrow="Our services" numeral="02" title="Hair, beauty & your big day." titleClass="statement text-h2 text-cherry" />
          <p className="mx-auto max-w-[30rem] text-center text-muted md:mx-0 md:text-left lg:col-span-4 lg:col-start-9">
            Specialising in hair and beauty, there is something for everyone, from a speedy tint to a full transformation.
          </p>
        </div>

        <motion.ul
          className="flex flex-col gap-4 lg:h-[min(78vh,46rem)] lg:flex-row lg:gap-3"
          variants={stagger(0.18)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {services.map((s, i) => {
            const open = active === i;
            return (
              <motion.li
                key={s.id}
                variants={floatUp}
                className={`frame relative min-h-[34rem] overflow-hidden transition-[flex-grow] duration-[1200ms] sm:min-h-[40rem] lg:min-h-0 ${open ? 'lg:grow-[2.4]' : 'lg:grow'} lg:basis-0`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <Link to={s.to} className="group absolute inset-0 flex flex-col justify-end text-ivory" data-cursor="Explore">
                  <span className="zoom-frame absolute inset-0">
                    <Photo id={s.photo} sizes="(min-width: 1024px) 50vw, 100vw" className={`h-full w-full object-cover transition-[scale] duration-[1600ms] ${open ? 'lg:scale-[1.03]' : 'lg:scale-110'}`} style={{ objectPosition: s.position }} />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-cherry/90 via-cherry/25 to-transparent" aria-hidden="true" />
                  <span className={`absolute inset-0 bg-cherry/30 transition-opacity duration-1000 ${open ? 'lg:opacity-0' : 'lg:opacity-100'}`} aria-hidden="true" />

                  <span className="relative flex flex-col items-center gap-4 p-8 text-center lg:items-start lg:p-10 lg:text-left">
                    <span className="statement text-h4 text-blush italic tabular-nums">{s.numeral}</span>
                    <span className="statement text-h2 leading-none text-ivory lg:text-[clamp(2rem,5.2vw_-_1.25rem,3.5rem)]">{s.title}</span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-[1200ms] lg:max-w-[26rem] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0'}`}>
                      <span className="overflow-hidden">
                        <span className="block text-small text-ivory/85">{s.text}</span>
                        <span className="label mt-6 inline-flex min-h-11 items-center gap-3 text-ivory">
                          Explore {s.title.toLowerCase()}
                          <ArrowRight className="size-4 transition-transform duration-700 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
