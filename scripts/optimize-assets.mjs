#!/usr/bin/env node
/**
 * Convierte los PNG/JPG de public/ (fondos, capas del personaje, iconos) a WebP (y AVIF opcional),
 * conservando el canal alfa. No borra los originales.
 *
 * Uso:
 *   npm i -D sharp            (una sola vez; gratis, sin servicios externos)
 *   npm run optimize:assets            -> genera .webp junto a cada .png
 *   npm run optimize:assets -- --avif  -> además genera .avif
 *
 * Después, cambia ASSET_EXT a 'webp' en src/app/core/services/character-asset.service.ts.
 */
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

let sharp;
try { sharp = (await import('sharp')).default; }
catch { console.error('Falta "sharp". Instálalo con: npm i -D sharp'); process.exit(1); }

const ROOT = new URL('../public/', import.meta.url).pathname;
const avif = process.argv.includes('--avif');
let before = 0, after = 0, count = 0;

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    if (!['.png', '.jpg', '.jpeg'].includes(extname(p).toLowerCase())) continue;
    const base = p.slice(0, -extname(p).length);
    before += (await stat(p)).size;
    await sharp(p).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(base + '.webp');
    after += (await stat(base + '.webp')).size;
    if (avif) await sharp(p).avif({ quality: 55, effort: 5 }).toFile(base + '.avif');
    count++;
  }
}

await walk(ROOT);
const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log(`${count} imágenes: ${kb(before)} -> ${kb(after)} (WebP)`);
