#!/usr/bin/env node
/**
 * Audita el SEO técnico del sitio construido en dist/.
 *
 * Sin dependencias. Node >= 20.
 *
 *   node scripts/audit-seo.mjs            # informe, siempre exit 0
 *   node scripts/audit-seo.mjs --strict   # exit 1 si hay errores
 *
 * Reglas y severidades: .opencode/skills/seo-tecnico/references/checklist.md
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const STRICT = process.argv.includes('--strict');

const errors = [];
const warnings = [];
const pages = [];

if (!existsSync(DIST)) {
  console.error(`No existe ${DIST}/. Ejecuta "npm run build" antes de auditar.`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function attr(tag, name) {
  const pattern = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const match = tag.match(pattern);
  if (!match) return null;
  return match[1] ?? match[2] ?? '';
}

function metaContent(html, key, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const actual = attr(tag, key);
    if (actual && actual.toLowerCase() === value.toLowerCase()) {
      return attr(tag, 'content') ?? '';
    }
  }
  return null;
}

function linkHref(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const value = attr(tag, 'rel');
    if (value && value.toLowerCase() === rel.toLowerCase()) return attr(tag, 'href') ?? '';
  }
  return null;
}

function titleOf(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, ' ').trim() : null;
}

function routeOf(relPath) {
  if (relPath === 'index.html') return '/';
  if (relPath.endsWith('/index.html')) return `/${relPath.slice(0, -'index.html'.length)}`;
  return `/${relPath.replace(/\.html$/i, '')}`;
}

function normalizePath(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function ldTypes(data, acc = []) {
  if (Array.isArray(data)) {
    for (const item of data) ldTypes(item, acc);
    return acc;
  }
  if (data && typeof data === 'object') {
    const type = data['@type'];
    if (typeof type === 'string') acc.push(type);
    if (Array.isArray(type)) acc.push(...type);
    if (data['@graph']) ldTypes(data['@graph'], acc);
  }
  return acc;
}

const error = (file, rule, message) => errors.push({ file, rule, message });
const warn = (file, rule, message) => warnings.push({ file, rule, message });

// ---------------------------------------------------------------- páginas

for (const file of walk(DIST)) {
  if (!file.toLowerCase().endsWith('.html')) continue;

  const relPath = relative(DIST, file).split(sep).join('/');
  const html = readFileSync(file, 'utf8');
  const route = routeOf(relPath);
  const isPublic = relPath !== '404.html';
  const title = titleOf(html);

  pages.push({ relPath, route, title });

  // El 404 no se indexa, pero debe ser una página real y accesible.
  if (!title) error(relPath, 'title', 'falta <title>');
  else if (title.length < 30 || title.length > 60) {
    error(relPath, 'title', `${title.length} caracteres (rango 30-60): "${title}"`);
  }

  const htmlTag = html.match(/<html\b[^>]*>/i);
  const lang = htmlTag ? attr(htmlTag[0], 'lang') : null;
  if (!lang) error(relPath, 'lang', 'falta el atributo lang en <html>');
  else if (lang.toLowerCase() !== 'es') {
    error(relPath, 'lang', `lang="${lang}", se esperaba "es"`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) error(relPath, 'h1', `${h1Count} elementos <h1> (se esperaba 1)`);

  if (!isPublic) continue;

  const description = metaContent(html, 'name', 'description');
  if (description === null) error(relPath, 'description', 'falta <meta name="description">');
  else if (description.length < 70 || description.length > 155) {
    error(relPath, 'description', `${description.length} caracteres (rango 70-155)`);
  }

  const canonical = linkHref(html, 'canonical');
  if (!canonical) {
    error(relPath, 'canonical', 'falta <link rel="canonical">');
  } else if (!/^https?:\/\//i.test(canonical)) {
    error(relPath, 'canonical', `no es absoluto: "${canonical}"`);
  } else {
    try {
      const url = new URL(canonical);
      if (url.search || url.hash) {
        error(relPath, 'canonical', 'contiene parámetros o fragmento');
      }
      if (normalizePath(url.pathname) !== normalizePath(route)) {
        error(relPath, 'canonical', `"${url.pathname}" no coincide con la ruta "${route}"`);
      }
    } catch {
      error(relPath, 'canonical', `URL inválida: "${canonical}"`);
    }
  }

  for (const property of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    const value = metaContent(html, 'property', property);
    if (value === null || value === '') error(relPath, property, 'falta o está vacío');
  }

  const ogImage = metaContent(html, 'property', 'og:image');
  if (ogImage && !/^https?:\/\//i.test(ogImage)) {
    error(relPath, 'og:image', `no es absoluta: "${ogImage}"`);
  }

  if (!metaContent(html, 'property', 'og:locale')) {
    warn(relPath, 'og:locale', 'falta og:locale (es_CO)');
  }

  const twitterCard = metaContent(html, 'name', 'twitter:card');
  if (!twitterCard) error(relPath, 'twitter:card', 'falta twitter:card');
  else if (twitterCard !== 'summary_large_image') {
    warn(relPath, 'twitter:card', `valor "${twitterCard}" (se esperaba summary_large_image)`);
  }

  const robots = metaContent(html, 'name', 'robots');
  if (robots && /noindex/i.test(robots)) {
    error(relPath, 'noindex', `página pública con "${robots}"`);
  }

  // Datos estructurados
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  if (blocks.length === 0 && relPath === 'index.html') {
    error(relPath, 'json-ld', 'la página principal no tiene datos estructurados');
  }

  const types = [];
  for (const [, raw] of blocks) {
    try {
      ldTypes(JSON.parse(raw.trim()), types);
    } catch (cause) {
      error(relPath, 'json-ld', `JSON-LD inválido: ${cause.message}`);
    }
  }

  if (relPath === 'index.html') {
    if (!types.includes('Person')) error(relPath, 'json-ld', 'falta el tipo Person');
    if (!types.includes('WebSite')) error(relPath, 'json-ld', 'falta el tipo WebSite');
    if (!types.includes('ProfilePage')) {
      warn(relPath, 'json-ld', 'falta el tipo ProfilePage');
    }
  }
}

// ---------------------------------------------------------------- títulos duplicados

const seen = new Map();
for (const page of pages) {
  if (!page.title) continue;
  const key = page.title.toLowerCase();
  if (seen.has(key)) warn(page.relPath, 'title', `duplicado con ${seen.get(key)}`);
  else seen.set(key, page.relPath);
}

// ---------------------------------------------------------------- sitio

const sitemap = ['sitemap-index.xml', 'sitemap.xml', 'sitemap-0.xml'].find((name) =>
  existsSync(join(DIST, name)),
);
if (!sitemap) error('/', 'sitemap', 'no se generó ningún sitemap');

const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) {
  error('/', 'robots.txt', 'no existe');
} else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) {
    error('/', 'robots.txt', 'bloquea todo el sitio con "Disallow: /"');
  }
  if (!/^\s*Sitemap:\s*https?:\/\//im.test(robots)) {
    error('/', 'robots.txt', 'falta una línea "Sitemap:" absoluta');
  }
}

if (!existsSync(join(DIST, '404.html'))) {
  error('/', '404', 'no existe 404.html');
}

// ---------------------------------------------------------------- informe

function printList(label, list) {
  if (list.length === 0) return;
  console.log(`\n${label} (${list.length})`);
  for (const item of list) {
    console.log(`  [${item.rule}] ${item.file}: ${item.message}`);
  }
}

console.log('SEO audit — dist/');
console.log(`Páginas analizadas: ${pages.length}`);
printList('ERRORES', errors);
printList('AVISOS', warnings);

console.log('\n' + '='.repeat(56));
console.log(`Errores: ${errors.length}   Avisos: ${warnings.length}`);

if (errors.length === 0) {
  console.log('Resultado: OK');
} else if (STRICT) {
  console.log('Resultado: FALLO (modo estricto)');
} else {
  console.log('Resultado: revisar (usa --strict para fallar)');
}

process.exit(STRICT && errors.length > 0 ? 1 : 0);
