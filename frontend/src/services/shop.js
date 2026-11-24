import api from './api';
import { BASE, IS_PREVIEW } from '../utils/asset';

// The online shop's products come from the salon's existing WooCommerce store, through our API (cached there).
// The GitHub Pages preview has no API: its build saves a snapshot of the same data (scripts/snapshot-shop.js),
// so the preview shows the real products and add-to-basket still hands over to the WooCommerce checkout.
const snapshot = (file) =>
  fetch(`${BASE}preview-data/shop/${file}`).then((r) => {
    if (!r.ok) throw Object.assign(new Error('That product is no longer available.'), { status: r.status });
    return r.json();
  });

export const getProducts = () => (IS_PREVIEW ? snapshot('products.json') : api.get('/shop/products').then((r) => r.data.data));
export const getProduct = (id) => (IS_PREVIEW ? snapshot(`${Number(id)}.json`) : api.get(`/shop/products/${id}`).then((r) => r.data.data));
