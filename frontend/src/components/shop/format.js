// Prices as the shop shows them: R1,250.00
export const money = (n) => `R${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const priceLabel = (p) => (p.priceMax && p.priceMax !== p.price ? `From ${money(p.price)}` : money(p.price));
export const withQuantity = (url, qty) => url.replace(/quantity=\d+/, `quantity=${qty}`);
