import { motion } from 'motion/react';
import { floatUp } from '../../utils/motion';
import { priceLabel } from './format';

// A product on clean white so the packaging reads clearly and true to colour.
export default function ProductCard({ product, onOpen }) {
  const img = product.image;
  return (
    <motion.li variants={floatUp} layout transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}>
      <button type="button" onClick={onOpen} className="group flex w-full flex-col text-left" data-cursor="View" aria-label={`${product.name}, ${priceLabel(product)}. View details`}>
        <span className="zoom-frame frame relative block aspect-square bg-[#ffffff]">
          {img && (
            <img
              src={img.src}
              srcSet={img.srcset || undefined}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 46vw"
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-[8%] mix-blend-multiply"
            />
          )}
          <span className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="label rounded-full bg-cherry px-2.5 py-1 text-[0.5625rem] text-ivory">New</span>}
            {product.onSale && <span className="label rounded-full bg-rose px-2.5 py-1 text-[0.5625rem] text-white">Sale</span>}
            {!product.inStock && <span className="label rounded-full bg-charcoal/80 px-2.5 py-1 text-[0.5625rem] text-ivory">Out of stock</span>}
          </span>
          <span className="label absolute inset-x-3 bottom-3 flex min-h-10 translate-y-2 items-center justify-center rounded-full bg-burgundy text-[0.625rem] text-white opacity-0 transition-[opacity,translate] duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" aria-hidden="true">
            {product.type === 'variable' ? 'Choose options' : 'Quick view'}
          </span>
        </span>
        <span className="label mt-4 text-[0.625rem] text-rose-ink">{product.brand}</span>
        <span className="statement mt-1 text-h4 leading-snug text-cherry">{product.name}</span>
        <span className="mt-2 text-small text-charcoal tabular-nums">{priceLabel(product)}</span>
      </button>
    </motion.li>
  );
}
