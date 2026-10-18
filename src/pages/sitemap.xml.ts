import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { KGP_WIDOKI } from '../data/kgp';

/**
 * Sitemapa budowana ręcznie, bez `@astrojs/sitemap`.
 *
 * Powód: na maszynie deweloperskiej nie ma node/npm (tylko bun), a w repo
 * jest tracked `package-lock.json`, z którego instaluje Vercel — dodanie
 * zależności bez regeneracji tego lockfile'a grozi rozjazdem na deployu.
 * Przy ~30 stronach ręczny endpoint jest i tak prostszy.
 *
 * Celowo tylko `<loc>`, bez `<priority>`/`<changefreq>`/`<lastmod>`:
 * Google jawnie ignoruje priority i changefreq (nadużywane do zera przez
 * cały internet — prawie każdy ustawiał 1.0 wszędzie). `<lastmod>` jest
 * owszem brane pod uwagę, ale tylko gdy "consistently and verifiably
 * accurate" względem realnej zmiany treści strony — pole `data` we
 * frontmatterze to data wyprawy, nie data edycji strony, więc podpięcie
 * go pod lastmod byłoby wprowadzającym w błąd sygnałem, dokładnie tym,
 * czego Google każe unikać. Sitemapa ma tu jedną robotę: zgłosić, że URL
 * istnieje.
 *
 * Trasy muszą się zgadzać z `trailingSlash: 'never'` z astro.config.mjs —
 * czyli bez końcowego slasha (poza stroną główną).
 */

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config.mjs musi mieć ustawione `site`');

  const szczyty = await getCollection('szczyty');
  const trasy = await getCollection('trasy');

  const sciezki: string[] = [
    '/',
    '/kgp',
    '/trasy',
    '/o-nas',

    // Strony zbiorcze KGP
    ...KGP_WIDOKI.map(w => `/kgp/${w.slug}`),

    // Relacje ze szczytów — rdzeń treści
    ...szczyty.map(s => `/szczyty/${s.id}`),

    // Trasy rowerowe
    ...trasy.map(t => `/trasy/${t.id}`),

    // Strony pomocnicze
    '/rabaty/maczfit',
    '/prywatnosc',
  ];

  const url = (sciezka: string) => new URL(sciezka, site).toString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sciezki.map(s => `  <url>\n    <loc>${url(s)}</loc>\n  </url>`).join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
};
