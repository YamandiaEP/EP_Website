#!/usr/bin/env node
// Dociska do wspólnego standardu zdjęcia w public/images, które nigdy nie
// przeszły przez convert-heic.mjs — czyli trafiły na dysk jako gotowe .jpg
// prosto z telefonu (do 5712x4284, kilka-kilkanaście MB), zamiast przez
// pipeline .HEIC -> .jpg. Strona używa tego samego pliku jako miniaturki
// 250px na stronie głównej i jako heroes/galerii, więc te zdjęcia ciążą
// najmocniej na czasie ładowania — 44 z 108 plików ważyły 168 z 197 MB.
//
// Te same parametry co convert-heic.mjs (celowo — po przejściu tego
// skryptu zdjęcie ma wyjść nieodróżnialne od tego, co produkuje konwersja
// HEIC): max 1920px szerokości, jakość 85, honoruje orientację EXIF.
//
// Nadpisuje pliki w miejscu. Oryginały zostają w historii gita (każdy
// commit da się odtworzyć przez `git show <sha>:ścieżka`), więc to nie
// jest nieodwracalne, ale nic nie jest kopiowane na bok na dysku.
//
// Użycie:
//   node scripts/optimize-images.mjs                  -> public/images
//   node scripts/optimize-images.mjs public/images     -> to samo, jawnie
//
// Pliki już ≤1920px szerokości są pomijane (idempotentne — bezpiecznie
// uruchomić ponownie po dodaniu nowych zdjęć, nie dotknie już poprawnych).

import { readdir, stat } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const TARGET_WIDTH = 1920;
const JPEG_QUALITY = 85;

async function main() {
  const dir = process.argv[2] || 'public/images';
  const entries = await readdir(dir);
  const files = entries.filter((f) => /\.(jpe?g)$/i.test(f));

  if (files.length === 0) {
    console.log(`Brak plików .jpg/.jpeg w ${dir}`);
    return;
  }

  let ruszone = 0, pominiete = 0, bledy = 0;
  let bajtyPrzed = 0, bajtyPo = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const before = await stat(filePath);
      const meta = await sharp(filePath).metadata();

      if (!meta.width || meta.width <= TARGET_WIDTH) {
        pominiete++;
        continue;
      }

      const buffer = await sharp(filePath)
        .rotate()
        .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      await sharp(buffer).toFile(filePath);

      const after = await stat(filePath);
      bajtyPrzed += before.size;
      bajtyPo += after.size;
      ruszone++;
      const przed = (before.size / 1024 / 1024).toFixed(1);
      const po = (after.size / 1024 / 1024).toFixed(1);
      console.log(`${file}: ${meta.width}x${meta.height} ${przed}M -> ${TARGET_WIDTH}px ${po}M`);
    } catch (e) {
      bledy++;
      console.error(`✗ ${file}: ${e.message}`);
    }
  }

  console.log();
  console.log(`Ruszone: ${ruszone}, pominięte (już ≤${TARGET_WIDTH}px): ${pominiete}, błędy: ${bledy}`);
  if (ruszone > 0) {
    const oszczednosc = ((1 - bajtyPo / bajtyPrzed) * 100).toFixed(0);
    console.log(
      `Waga: ${(bajtyPrzed / 1024 / 1024).toFixed(0)} MB -> ${(bajtyPo / 1024 / 1024).toFixed(0)} MB ` +
      `(-${oszczednosc}%)`
    );
  }
  if (bledy > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Błąd:', err.message);
  process.exit(1);
});
