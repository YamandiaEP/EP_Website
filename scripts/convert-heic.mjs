#!/usr/bin/env node
// Konwertuje wszystkie pliki .HEIC/.heic w podanym folderze na .jpg
// (skalowane do max 1920px szerokości, honorują orientację EXIF).
//
// Użycie:
//   npm run convert-heic                    -> konwertuje public/images
//   npm run convert-heic -- public/images   -> to samo, jawnie
//
// Oryginały .HEIC NIE są usuwane automatycznie — usuń je ręcznie po
// sprawdzeniu wyników (jak w public/images/*.jpg dla danego szczytu/trasy).

import { readdir, readFile } from 'fs/promises';
import path from 'path';
import convert from 'heic-convert';
import sharp from 'sharp';

const TARGET_WIDTH = 1920;
const JPEG_QUALITY = 85;

async function main() {
  const dir = process.argv[2] || 'public/images';
  const entries = await readdir(dir);
  const files = entries.filter((f) => /\.heic$/i.test(f));

  if (files.length === 0) {
    console.log(`Brak plików .HEIC w ${dir}`);
    return;
  }

  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputName = file.replace(/\.heic$/i, '.jpg');
    const outputPath = path.join(dir, outputName);

    const inputBuffer = await readFile(inputPath);
    // heic-convert dekoduje HEIC -> JPEG (sam Sharp nie ma wbudowanego kodeka HEIC)
    const jpegBuffer = await convert({ buffer: inputBuffer, format: 'JPEG', quality: 1 });

    // Sharp: honoruje orientację EXIF, skaluje i dociska jakość/wagę pliku
    await sharp(jpegBuffer)
      .rotate()
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outputPath);

    console.log(`${file} -> ${outputName}`);
  }

  console.log(`\nGotowe: ${files.length} plik(ów) przekonwertowanych.`);
  console.log('Oryginały .HEIC zostały pozostawione — usuń je ręcznie, gdy sprawdzisz wyniki.');
}

main().catch((err) => {
  console.error('Błąd konwersji:', err.message);
  process.exit(1);
});
