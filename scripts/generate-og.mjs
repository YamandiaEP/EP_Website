/**
 * Generuje obrazki Open Graph 1200x630 do `public/og/`.
 *
 * Po co: zdjęcia w `public/images/` są surowe z telefonu (do 5712x4284, ~8 MB).
 * Twitter/X odrzuca og:image powyżej 5 MB, a Facebook i tak je przeskaluje —
 * czyli bez tego kroku share cardy by nie działały albo ładowały się wiecznie.
 * Generujemy osobne, lekkie kopie i tylko na nie wskazuje `og:image`.
 *
 * Uruchomienie:  bun run generate-og      (albo: npm run generate-og)
 *
 * Skrypt jest idempotentny — pomija pliki, które są już aktualne (nowsze
 * niż źródło). Wymuszenie przebudowy: `bun run generate-og -- --force`.
 *
 * Wynik commitujemy do repo, żeby build na Vercelu nie musiał mieć sharpa.
 */

import { readdir, readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OG_DIR = path.join(ROOT, 'public', 'og');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const FORCE = process.argv.includes('--force');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** Zdjęcie użyte dla stron bez własnego (strona główna, /kgp/*, /o-nas). */
const DEFAULT_SOURCE = 'sniezka.jpg';

/** Wyciąga wartość pola `photo:` z frontmattera markdowna. */
function wyciagnijPhoto(tresc) {
  const m = tresc.match(/^photo:\s*["']?([^"'\n]+)["']?\s*$/m);
  return m ? m[1].trim() : null;
}

async function nowszeNizZrodlo(zrodlo, cel) {
  if (FORCE) return false;
  try {
    const [s, c] = await Promise.all([stat(zrodlo), stat(cel)]);
    return c.mtimeMs >= s.mtimeMs;
  } catch {
    return false; // cel nie istnieje
  }
}

async function zrobOg(zrodlo, cel, etykieta) {
  if (await nowszeNizZrodlo(zrodlo, cel)) {
    console.log(`  = ${etykieta} (aktualne, pomijam)`);
    return 'skip';
  }
  await sharp(zrodlo)
    .rotate() // honoruj orientację EXIF, inaczej zdjęcia z telefonu wychodzą obrócone
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(cel);
  const { size } = await stat(cel);
  console.log(`  + ${etykieta} (${Math.round(size / 1024)} kB)`);
  return 'ok';
}

async function main() {
  await mkdir(OG_DIR, { recursive: true });

  const zadania = [];

  // 1) Szczyty i trasy — po jednym obrazku na slug, ze zdjęcia z frontmattera
  for (const kolekcja of ['szczyty', 'trasy']) {
    const dir = path.join(ROOT, 'src', 'content', kolekcja);
    let pliki;
    try {
      pliki = (await readdir(dir)).filter(f => f.endsWith('.md'));
    } catch {
      continue;
    }
    for (const plik of pliki) {
      const slug = plik.replace(/\.md$/, '');
      const tresc = await readFile(path.join(dir, plik), 'utf8');
      const photo = wyciagnijPhoto(tresc);
      if (!photo) {
        console.log(`  ! ${kolekcja}/${slug}: brak pola photo — użyje domyślnego og`);
        continue;
      }
      const zrodlo = path.join(ROOT, 'public', photo.replace(/^\//, ''));
      zadania.push({
        zrodlo,
        cel: path.join(OG_DIR, `${slug}.jpg`),
        etykieta: `${slug}.jpg`,
      });
    }
  }

  // 2) Domyślny obrazek dla stron bez własnego zdjęcia
  zadania.push({
    zrodlo: path.join(IMAGES_DIR, DEFAULT_SOURCE),
    cel: path.join(OG_DIR, 'default.jpg'),
    etykieta: 'default.jpg',
  });

  console.log(`Generuję ${zadania.length} obrazków OG (${OG_WIDTH}x${OG_HEIGHT}) →  public/og/\n`);

  let ok = 0, skip = 0, bledy = 0;
  for (const z of zadania) {
    try {
      const wynik = await zrobOg(z.zrodlo, z.cel, z.etykieta);
      wynik === 'ok' ? ok++ : skip++;
    } catch (e) {
      bledy++;
      console.error(`  ✗ ${z.etykieta}: ${e.message}`);
    }
  }

  // .gitkeep, żeby katalog przeżył nawet gdy ktoś wyczyści zawartość
  await writeFile(path.join(OG_DIR, '.gitkeep'), '');

  console.log(`\nGotowe: ${ok} nowych, ${skip} pominiętych, ${bledy} błędów.`);
  if (bledy) process.exitCode = 1;
}

main();
