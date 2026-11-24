// GitHub Pages preview only: saves the shop's product list and each product's details as static JSON,
// using the backend's own shop code, so the preview's Shop page works without an API.
//   node scripts/snapshot-shop.js <output folder>
// Run by .github/workflows/pages.yml after the frontend build. Needs backend/node_modules (npm ci --prefix backend).
const fs = require('fs');
const path = require('path');

// env.js insists on database settings; the shop code never touches the database, so placeholders are fine here.
process.env.MYSQL_DATABASE ||= 'preview';
process.env.MYSQL_USER ||= 'preview';
process.env.MYSQL_PASSWORD ||= 'preview';

const shop = require('../backend/src/services/shop.service');

(async () => {
  const out = path.resolve(process.argv[2] || 'frontend/dist/preview-data/shop');
  fs.mkdirSync(out, { recursive: true });

  const list = await shop.list();
  fs.writeFileSync(path.join(out, 'products.json'), JSON.stringify(list));

  let saved = 0;
  for (const item of list.items) {
    try {
      fs.writeFileSync(path.join(out, `${item.id}.json`), JSON.stringify(await shop.detail(item.id)));
      saved += 1;
    } catch (error) {
      console.warn(`Skipped product ${item.id}: ${error.message}`);
    }
  }
  console.log(`Shop snapshot: ${list.items.length} products, ${saved} detail files -> ${out}`);
})().catch((error) => {
  console.error('Shop snapshot failed:', error.message);
  process.exit(1);
});
