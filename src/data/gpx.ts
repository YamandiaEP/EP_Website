/**
 * Wyciąganie współrzędnych szczytu z plików GPX — używane do `geo` w JSON-LD
 * (schema.org/Mountain) na stronach szczytów.
 *
 * Czyta z `public/gpx/*.gpx` w trakcie builda (SSG), więc zero kosztu runtime.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

export type Wspolrzedne = { lat: number; lon: number; ele: number };

const TRKPT_RE = /<trkpt\s+lat="(-?[\d.]+)"\s+lon="(-?[\d.]+)"\s*>\s*<ele>(-?[\d.]+)<\/ele>/g;

/**
 * Najwyższy punkt śladu.
 *
 * `oczekiwanaWysokosc` to wysokość szczytu z frontmattera. Zwracamy punkt
 * TYLKO jeśli ślad faktycznie kończy się na tym szczycie (najwyższy punkt
 * mieści się w `tolerancja` metrów od deklarowanej wysokości).
 *
 * Powód tego warunku: część plików GPX jest współdzielona przez dwa szczyty
 * (`kowadlo_rudawiec.gpx`, `szczawnica.gpx` → Radziejowa + Wysoka). Dla
 * niższego z nich najwyższy punkt śladu należy do drugiego szczytu, a
 * szukanie "punktu o wysokości najbliższej deklarowanej" trafiłoby gdzieś
 * na podejściu, nie na wierzchołku. Błędne współrzędne w schemie są gorsze
 * niż ich brak, więc w takim wypadku zwracamy null.
 */
export function szczytZGpx(
  gpxSciezka: string,
  oczekiwanaWysokosc: number,
  tolerancja = 30,
): Wspolrzedne | null {
  let tresc: string;
  try {
    tresc = readFileSync(path.join(process.cwd(), 'public', gpxSciezka.replace(/^\//, '')), 'utf8');
  } catch {
    return null;
  }

  let najwyzszy: Wspolrzedne | null = null;
  for (const m of tresc.matchAll(TRKPT_RE)) {
    const punkt = { lat: Number(m[1]), lon: Number(m[2]), ele: Number(m[3]) };
    if (!najwyzszy || punkt.ele > najwyzszy.ele) najwyzszy = punkt;
  }

  if (!najwyzszy) return null;
  if (Math.abs(najwyzszy.ele - oczekiwanaWysokosc) > tolerancja) return null;

  return {
    lat: Number(najwyzszy.lat.toFixed(6)),
    lon: Number(najwyzszy.lon.toFixed(6)),
    ele: Math.round(najwyzszy.ele),
  };
}
