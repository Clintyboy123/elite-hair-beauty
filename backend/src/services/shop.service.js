// The online shop, read from the salon's existing WooCommerce store (its public Store API, no keys needed).
// The website shows the products in its own design; the basket, checkout, payment and delivery stay on the
// WooCommerce shop, so nothing about how orders are paid for or delivered changes.
//
// Add-to-basket links use WooCommerce's own URL format, tested against the live shop on 2026-11-20:
//   simple product:  {SHOP_URL}/basket/?add-to-cart={id}&quantity={n}
//   variation:       {SHOP_URL}/basket/?add-to-cart={parent}&variation_id={id}&attribute_{taxonomy}={slug}&quantity={n}
// Results are cached in memory (SHOP_CACHE_MINUTES); if the shop is unreachable the last good copy is served.
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const API = `${env.shop.url}/wp-json/wc/store/v1`;
const cache = new Map(); // key -> { value, expires }

// Brand labels for the filter. Products without a category are named after their brand.
const BRAND_NAMES = { 'moroccan oil': 'Moroccanoil', moroccanoil: 'Moroccanoil', mankind: 'Motherkind' };
const KNOWN = ['Kadus', 'Moroccanoil', 'Motherkind', 'Wella', 'Nioxin'];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—', hellip: '…', bull: '•', trade: '™', reg: '®', copy: '©' };
const decode = (text) =>
  text
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);

// WooCommerce descriptions are HTML written in the WordPress editor. The site only ever renders plain text:
// paragraphs and bullet lines are kept, every tag is dropped.
const toParagraphs = (html = '') =>
  decode(
    html
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h\d)>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
  )
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n')
    )
    .filter(Boolean);

const rands = (minor, unit = 2) => Number(minor) / 10 ** unit;

const brandOf = (p) => {
  const category = p.categories?.[0]?.name?.trim();
  const raw = (category || p.name.split(' ')[0]).toLowerCase();
  const name = BRAND_NAMES[raw] || KNOWN.find((k) => k.toLowerCase() === raw) || category || 'Other';
  return name;
};

// WordPress alt texts on this shop are mostly file names, so images are described by the product instead.
const image = (img, alt) =>
  img
    ? {
        src: img.src,
        thumbnail: img.thumbnail,
        srcset: img.srcset || '',
        alt,
      }
    : null;

const summarise = (p) => {
  const unit = p.prices.currency_minor_unit;
  const range = p.prices.price_range;
  return {
    id: p.id,
    name: decode(p.name),
    slug: p.slug,
    type: p.type,
    brand: brandOf(p),
    price: rands(range ? range.min_amount : p.prices.price, unit),
    priceMax: range ? rands(range.max_amount, unit) : null,
    regularPrice: rands(p.prices.regular_price, unit),
    onSale: Boolean(p.on_sale),
    inStock: Boolean(p.is_in_stock),
    purchasable: Boolean(p.is_purchasable),
    isNew: /new/i.test(p.tags?.map((t) => t.name).join(' ') || ''),
    image: image(p.images?.[0], decode(p.name)),
    permalink: p.permalink,
    addToBasket: p.type === 'simple' ? `${env.shop.url}/basket/?add-to-cart=${p.id}&quantity=1` : null,
  };
};

const getJson = async (path) => {
  const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (response.status === 404) throw new ApiError(404, 'That product is no longer available.');
  if (!response.ok) throw new Error(`Shop answered ${response.status}`);
  return response.json();
};

const cached = async (key, load) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  try {
    const value = await load();
    cache.set(key, { value, expires: Date.now() + env.shop.cacheMinutes * 60 * 1000 });
    return value;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error(`[shop] ${key}: the shop could not be reached:`, error.message);
    if (hit) return hit.value; // stale but useful
    throw new ApiError(503, 'The online shop is not responding right now. Please try again shortly.');
  }
};

exports.list = () =>
  cached('list', async () => {
    const products = [];
    for (let page = 1; page <= 5; page += 1) {
      const batch = await getJson(`/products?per_page=100&page=${page}&orderby=menu_order&order=asc`);
      products.push(...batch);
      if (batch.length < 100) break;
    }
    const items = products.filter((p) => p.type !== 'variation').map(summarise);
    const brands = [...new Set(items.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));
    return { items, brands, basketUrl: `${env.shop.url}/basket/`, shopUrl: `${env.shop.url}/shop/` };
  });

exports.detail = (id) =>
  cached(`product:${id}`, async () => {
    const p = await getJson(`/products/${id}`);
    if (p.type === 'variation') throw new ApiError(404, 'That product is no longer available.');
    const base = summarise(p);
    const attribute = p.attributes?.find((a) => a.has_variations);
    let variations = [];
    if (p.type === 'variable' && p.variations?.length) {
      const details = await Promise.all(p.variations.map((v) => getJson(`/products/${v.id}`).catch(() => null)));
      variations = p.variations
        .map((v, i) => {
          const d = details[i];
          if (!d) return null;
          const value = v.attributes[0]?.value;
          const term = attribute?.terms?.find((t) => t.slug === value);
          const query = v.attributes.map((a) => {
            const attr = p.attributes.find((x) => x.name === a.name);
            const key = attr?.taxonomy || `attribute_${a.name.toLowerCase().replace(/\s+/g, '-')}`;
            return `attribute_${key.replace(/^attribute_/, '')}=${encodeURIComponent(a.value)}`;
          });
          return {
            id: v.id,
            label: decode(term?.name || value || d.name),
            price: rands(d.prices.price, d.prices.currency_minor_unit),
            inStock: Boolean(d.is_in_stock),
            image: image(d.images?.[0], `${decode(p.name)}, ${decode(term?.name || value || '')}`),
            addToBasket: `${env.shop.url}/basket/?add-to-cart=${p.id}&variation_id=${v.id}&${query.join('&')}&quantity=1`,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.price - b.price || a.label.localeCompare(b.label));
    }
    return {
      ...base,
      images: (p.images || []).map((img) => image(img, decode(p.name))),
      description: toParagraphs(p.description || p.short_description),
      option: attribute ? decode(attribute.name) : null,
      variations,
    };
  });
