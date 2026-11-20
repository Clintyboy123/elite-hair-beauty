import api from './api';

// The online shop's products come from the salon's existing WooCommerce store, through our API (cached there).
export const getProducts = () => api.get('/shop/products').then((r) => r.data.data);
export const getProduct = (id) => api.get(`/shop/products/${id}`).then((r) => r.data.data);
