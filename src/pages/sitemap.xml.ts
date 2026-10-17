import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { KGP_WIDOKI } from '../data/kgp';

/**
 * Sitemapa budowana ręcznie, bez `@astrojs/sitemap`.
 *
 * Powód: na maszynie deweloperskiej nie ma node/npm (tylko bun), a w repo
 * jest tracked `package-lock.json`, z którego instaluje Vercel — dodanie
 * zależności bez regeneracji tego lockfile'a grozi rozjazdem na deployu.
 * Przy ~30 stronach ręczny endpoint jest i tak prostszy, a daje kontrolę nad
 * `priority` i `lastmod`.
 *
 * Trasy muszą się zgadzać z `trailingSlash: 'never'` z astro.config.mjs —
 * czyli bez końcowego slasha (poza stroną główną).
 */

type Wpis = { sciezka: string; priority: string; lastmod?: string };

/** Zwraca YYYY-MM-DD tylko dla faktycznie poprawnej daty — nie zmyślamy lastmod. */
function lastmodZDaty(data: string | undefined): string | undefined {
  if (!data) return undefined;
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config.mjs musi mieć ustawione `site`');

  const szczyty = await getCollection('szczyty');
  const trasy = await getCollection('trasy');

  const wpisy: Wpis[] = [
    { sciezka: '/', priority: '1.0' },
    { sciezka: '/kgp', priority: '0.9' },
    { sciezka: '/trasy', priority: '0.8' },
    { sciezka: '/o-nas', priority: '0.6' },

    // Strony zbiorcze KGP
    ...KGP_WIDOKI.map(w => ({ sciezka: `/kgp/${w.slug}`, priority: '0.8' })),

    // Relacje ze szczytów — rdzeń treści
    ...szczyty.map(s => ({
      sciezka: `/szczyty/${s.id}`,
      priority: '0.9',
      lastmod: lastmodZDaty(s.data.data),
    })),

    // Trasy rowerowe
    ...trasy.map(t => ({
      sciezka: `/trasy/${t.id}`,
      priority: '0.7',
      lastmod: lastmodZDaty(t.data.data),
    })),

    // Strony pomocnicze — indeksowalne, ale bez priorytetu
    { sciezka: '/rabaty/maczfit', priority: '0.3' },
    { sciezka: '/prywatnosc', priority: '0.1' },
  ];

  const url = (sciezka: string) => new URL(sciezka, site).toString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${wpisy
  .map(w => {
    const lastmod = w.lastmod ? `\n    <lastmod>${w.lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${url(w.sciezka)}</loc>${lastmod}
    <priority>${w.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
