import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderCircle, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import Button from '../ui/Button';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import { getProduct } from '../../services/shop';
import { ease } from '../../utils/motion';
import { money, priceLabel, withQuantity } from './format';

// Product details in a side panel (full screen on phones). Choosing an option shows its own price and photo.
// "Add to basket" hands over to the salon's existing online shop, which adds it to the basket and takes care
// of checkout, payment and delivery.
export default function ProductDrawer({ product, basketUrl, onClose }) {
  const ref = useRef(null);
  const open = Boolean(product);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [variationId, setVariationId] = useState(null);
  const [qty, setQty] = useState(1);
  useFocusTrap(ref, open);
  useScrollLock(open);

  useEffect(() => {
    if (!product) return undefined;
    let live = true;
    setDetail(null);
    setError('');
    setVariationId(null);
    setQty(1);
    getProduct(product.id)
      .then((d) => live && setDetail(d))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [product]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const variation = detail?.variations?.find((v) => v.id === variationId);
  const needsOption = detail?.type === 'variable';
  const image = variation?.image || detail?.image || product?.image;
  const basket = needsOption ? variation?.addToBasket : detail?.addToBasket || product?.addToBasket;
  const inStock = needsOption ? variation?.inStock : (detail || product)?.inStock;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex justify-end" initial={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.8 } }}>
          <motion.button
            type="button"
            className="absolute inset-0 cursor-default bg-cherry-deep/60 backdrop-blur-[2px]"
            aria-label="Close product details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
            tabIndex={-1}
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="relative flex h-full w-full flex-col overflow-y-auto bg-ivory sm:max-w-[34rem]"
            initial={{ x: '100%' }}
            animate={{ x: '0%', transition: { duration: 1.1, ease } }}
            exit={{ x: '100%', transition: { duration: 0.7, ease } }}
          >
            <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-line-light bg-ivory/90 px-6 backdrop-blur-md">
              <p className="label text-rose-ink">{product.brand}</p>
              <button type="button" onClick={onClose} className="-mr-3 flex size-12 items-center justify-center text-cherry" aria-label="Close">
                <X className="size-5" strokeWidth={1.25} aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-square shrink-0 bg-[#ffffff]">
              <AnimatePresence mode="wait" initial={false}>
                {image && (
                  <motion.img
                    key={image.src}
                    src={image.src}
                    srcSet={image.srcset || undefined}
                    sizes="(min-width: 640px) 34rem, 100vw"
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-contain p-[10%]"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease } }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10">
              <div className="flex flex-col gap-2">
                <h2 className="statement text-h3 text-cherry">{product.name}</h2>
                <p className="text-lead text-charcoal tabular-nums" aria-live="polite">
                  {variation ? money(variation.price) : priceLabel(product)}
                </p>
              </div>

              {!detail && !error && (
                <p className="flex items-center gap-3 text-small text-muted" role="status">
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Loading details…
                </p>
              )}
              {error && (
                <p className="text-small text-danger" role="alert">
                  {error}{' '}
                  <a href={product.permalink} className="link-line text-burgundy [background-size:100%_1px]">
                    View it on our shop
                  </a>
                </p>
              )}

              {detail && (
                <>
                  {needsOption && (
                    <fieldset>
                      <legend className="label text-cherry">{detail.option || 'Option'}</legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {detail.variations.map((v) => (
                          <label
                            key={v.id}
                            className={`chip ${variationId === v.id ? 'border-burgundy bg-burgundy text-white' : 'border-cherry/20 text-charcoal hover:border-burgundy/60'} ${!v.inStock ? 'opacity-50' : ''} has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-rose`}
                          >
                            <input type="radio" name="variation" className="sr-only" checked={variationId === v.id} onChange={() => setVariationId(v.id)} disabled={!v.inStock} />
                            {v.label}
                            <span className={`tabular-nums ${variationId === v.id ? 'text-white/75' : 'text-muted'}`}>{money(v.price)}</span>
                            {!v.inStock && <span className="sr-only">(out of stock)</span>}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-[3.25rem] items-center justify-between rounded-full border border-cherry/20 px-2 sm:w-36" role="group" aria-label="Quantity">
                      <button type="button" className="flex size-10 items-center justify-center text-cherry disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="One fewer">
                        <Minus className="size-4" strokeWidth={1.25} aria-hidden="true" />
                      </button>
                      <span className="tabular-nums text-cherry" aria-live="polite">
                        {qty}
                      </span>
                      <button type="button" className="flex size-10 items-center justify-center text-cherry disabled:opacity-30" onClick={() => setQty((q) => Math.min(20, q + 1))} disabled={qty >= 20} aria-label="One more">
                        <Plus className="size-4" strokeWidth={1.25} aria-hidden="true" />
                      </button>
                    </div>
                    {basket && inStock ? (
                      <Button href={withQuantity(basket, qty)} target="_self" arrow className="flex-1">
                        Add to basket
                      </Button>
                    ) : (
                      <Button disabled className="flex-1">
                        {needsOption && !variation ? `Choose a ${(detail.option || 'option').toLowerCase()}` : 'Out of stock'}
                      </Button>
                    )}
                  </div>

                  <p className="flex items-start gap-3 text-[0.8125rem] text-muted">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-rose" strokeWidth={1.25} aria-hidden="true" />
                    You’ll continue to our secure online shop for your basket, payment and delivery.
                  </p>

                  {detail.description.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-line-light pt-6 text-small text-charcoal/85">
                      {detail.description.map((para, i) => (
                        <p key={i} className="whitespace-pre-line">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-x-8 gap-y-2 border-t border-line-light pt-6">
                    <a href={basketUrl} className="text-link text-burgundy">
                      <span className="rule" aria-hidden="true" />
                      <span>View basket</span>
                    </a>
                    <a href={product.permalink} className="text-link text-burgundy">
                      <span className="rule" aria-hidden="true" />
                      <span>Product page</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
