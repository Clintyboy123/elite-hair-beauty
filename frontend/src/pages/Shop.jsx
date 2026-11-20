import { useEffect, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import PageHero from '../components/sections/PageHero';
import ProductCard from '../components/shop/ProductCard';
import ProductDrawer from '../components/shop/ProductDrawer';
import Button from '../components/ui/Button';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { getProducts } from '../services/shop';
import { brands as retailBrands } from '../content/site';
import { ease, stagger } from '../utils/motion';

export default function Shop() {
  useSeo({
    title: 'Shop',
    description: 'Shop professional hair care and beauty from Elite Hair & Beauty in Walmer, Gqeberha: Kadus, Moroccanoil, Nioxin, Wella and Motherkind, with secure online checkout and delivery.',
    path: '/shop',
  });
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });
  const [brand, setBrand] = useState('All');
  const [open, setOpen] = useState(null);

  const load = () => {
    setState({ status: 'loading', data: null, error: '' });
    getProducts()
      .then((data) => setState({ status: 'ready', data, error: '' }))
      .catch((e) => setState({ status: 'error', data: null, error: e.message }));
  };
  useEffect(load, []);

  const items = state.data?.items || [];
  const shown = brand === 'All' ? items : items.filter((p) => p.brand === brand);
  const basketUrl = state.data?.basketUrl || 'https://www.elitehair.co.za/basket/';

  return (
    <>
      <PageHero
        variant="light"
        eyebrow="The Elite shop"
        title={['SHOP']}
        label="Shop"
        intro="Our comprehensive retail offering includes some of the most trusted brands from around the world, chosen by the people who use them on your hair every day."
        photo="salon-retail"
      >
        <Button href={basketUrl} target="_self" variant="outline" className="w-full sm:w-auto">
          <ShoppingBag className="size-4" strokeWidth={1.25} aria-hidden="true" /> View basket
        </Button>
      </PageHero>

      <section className="bg-white pb-section" aria-label="Products">
        <div className="sticky top-0 z-30 border-y border-line-light bg-white/90 backdrop-blur-md">
          <div className="shell no-scrollbar flex gap-2 overflow-x-auto py-3 lg:justify-center" role="group" aria-label="Filter by brand">
            {['All', ...(state.data?.brands || [])].map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={brand === b}
                onClick={() => setBrand(b)}
                className={`label relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 whitespace-nowrap transition-colors duration-700 ${brand === b ? 'text-white' : 'text-cherry hover:text-burgundy'}`}
              >
                {brand === b && <motion.span layoutId="shop-filter" className="absolute inset-0 -z-10 rounded-full bg-burgundy" transition={{ duration: 0.9, ease }} />}
                {b}
                {state.data && <span className={`text-[0.625rem] tabular-nums ${brand === b ? 'text-white/70' : 'text-muted'}`}>{b === 'All' ? items.length : items.filter((p) => p.brand === b).length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="shell mt-12">
          {state.status === 'loading' && (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading products" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="flex animate-pulse flex-col gap-3">
                  <span className="aspect-square bg-ivory" />
                  <span className="h-3 w-16 bg-ivory" />
                  <span className="h-5 w-3/4 bg-ivory" />
                </li>
              ))}
            </ul>
          )}

          {state.status === 'error' && (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center" role="alert">
              <p className="statement text-h3 text-cherry">The shop is taking a moment.</p>
              <p className="text-muted">{state.error}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={load} variant="burgundy">
                  Try again
                </Button>
                <Button href="https://www.elitehair.co.za/shop/" target="_self" variant="outline">
                  Open the shop directly
                </Button>
              </div>
            </div>
          )}

          {state.status === 'ready' && (
            <LayoutGroup>
              <motion.ul key={brand} className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4" variants={stagger(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.01 }}>
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={() => setOpen(p)} />
                ))}
              </motion.ul>
              {!shown.length && <p className="py-16 text-center text-muted">No products from this brand right now.</p>}
            </LayoutGroup>
          )}
        </div>
      </section>

      {/* In the salon */}
      <section className="bg-champagne py-band">
        <Reveal className="shell flex flex-col items-center gap-6 text-center">
          <p className="label text-rose-ink">Also on our shelves in the salon</p>
          <p className="statement max-w-4xl text-h4 text-cherry">{retailBrands.join(' · ')}</p>
          <p className="max-w-xl text-small text-muted">Not sure what your hair needs? Ask your stylist at your next visit, or send us a message.</p>
        </Reveal>
      </section>

      <ProductDrawer product={open} basketUrl={basketUrl} onClose={() => setOpen(null)} />
    </>
  );
}
