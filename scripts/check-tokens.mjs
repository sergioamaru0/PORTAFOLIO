#!/usr/bin/env node
/**
 * Prohíbe colores de paleta y hexadecimales crudos en el markup del proyecto.
 *
 * Sin dependencias. Node >= 20.
 *
 *   node scripts/check-tokens.mjs
 *
 * Escape hatch puntual: añade el comentario `tokens-ok` en la línea.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOTS = ['src/components', 'src/pages', 'src/layouts'];
const EXTENSIONS = ['.astro', '.tsx', '.jsx'];

const PALETTE =
  /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|placeholder|decoration|outline|shadow|accent|caret)-(?:white|black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d{1,3})?\b/;

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const CLASS_ATTR = /\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTENSIONS.some((ext) => full.endsWith(ext))) out.push(full);
  }
  return out;
}

const violations = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const relPath = relative('.', file).split(sep).join('/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);

    lines.forEach((line, index) => {
      if (line.includes('tokens-ok')) return;

      const palette = line.match(PALETTE);
      if (palette) {
        violations.push({
          file: relPath,
          line: index + 1,
          token: palette[0],
          reason: 'color de paleta; usa un token semántico',
        });
        return;
      }

      const classAttr = line.match(CLASS_ATTR);
      const classValue = classAttr ? (classAttr[1] ?? classAttr[2] ?? classAttr[3] ?? '') : '';
      const hex = classValue.match(HEX);
      if (hex) {
        violations.push({
          file: relPath,
          line: index + 1,
          token: hex[0],
          reason: 'hexadecimal en clase; declara el color como token',
        });
      }
    });
  }
}

if (violations.length === 0) {
  console.log('Tokens: OK — sin colores de paleta en componentes.');
  process.exit(0);
}

console.log(`Tokens: ${violations.length} violación(es)`);
for (const item of violations) {
  console.log(`  ${item.file}:${item.line}  ${item.token}  — ${item.reason}`);
}
console.log('\nSolo tokens semánticos: bg-background, text-foreground, border-border…');
process.exit(1);
