import { defineConfig } from 'astro/config';

export default defineConfig({
  // Kanoniczna domena = www (apex 308-przekierowuje na www na Vercelu).
  // Z tego buduje się canonical i og:url w Layout.astro oraz sitemap.xml.
  site: 'https://www.yamandia.com',
  base: '/',
  // Jedna strona = jeden URL. Vercel (vercel.json) przekierowuje wersję
  // ze slashem na wersję bez, canonical też emituje wersję bez slasha.
  trailingSlash: 'never',
});
