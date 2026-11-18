# Checklist SEO — portafolio estático

Marca solo lo verificado. `E` = error (bloquea), `W` = aviso.

## Metadatos

| # | Comprobación | Sev. | Criterio |
|---|---|---|---|
| 1 | `<title>` presente en todas las páginas | E | no vacío |
| 2 | Longitud del title | E | 30–60 caracteres |
| 3 | Title único por página | E | sin duplicados |
| 4 | `meta description` presente | E | no vacía |
| 5 | Longitud de la description | E | 70–155 caracteres |
| 6 | Description única por página | W | sin duplicados |
| 7 | Description con propuesta de valor | W | no es un listado de keywords |
| 8 | `link rel=canonical` absoluto | E | empieza por `https://` |
| 9 | Canonical autorreferente | E | coincide con la ruta |
| 10 | Canonical sin parámetros | E | sin `?` ni `#` |
| 11 | `og:title` | E | presente |
| 12 | `og:description` | E | presente |
| 13 | `og:type` | E | `website` o `profile` |
| 14 | `og:url` | E | igual al canonical |
| 15 | `og:image` absoluta | E | 1200×630 |
| 16 | `og:image:alt` | W | descriptivo |
| 17 | `og:locale` | W | `es_CO` |
| 18 | `twitter:card` | E | `summary_large_image` |
| 19 | `html lang` | E | `es` |
| 20 | `theme-color` | W | coincide con el tema |

## Rastreo

| # | Comprobación | Sev. | Criterio |
|---|---|---|---|
| 21 | `robots.txt` existe | E | en la raíz del build |
| 22 | `robots.txt` no bloquea el sitio | E | sin `Disallow: /` |
| 23 | `robots.txt` referencia el sitemap | E | línea `Sitemap:` absoluta |
| 24 | Sitemap generado | E | `sitemap-index.xml` o `sitemap.xml` |
| 25 | Sitemap incluye todas las rutas públicas | E | sin faltantes |
| 26 | Sitemap excluye rutas `noindex` | W | coherente |
| 27 | `404.html` existe | E | |
| 28 | La 404 devuelve status 404 | E | verificado en producción |
| 29 | Sin `noindex` en páginas públicas | E | |
| 30 | Sin enlaces internos rotos | E | 0 enlaces 404 |
| 31 | URLs limpias y estables | W | sin `index.html` visible |
| 32 | PDFs con `X-Robots-Tag: noindex` | E | si permanecen en el sitio |

## Semántica

| # | Comprobación | Sev. | Criterio |
|---|---|---|---|
| 33 | Un solo `h1` | E | exactamente uno |
| 34 | Jerarquía de encabezados | W | sin saltos h2 → h4 |
| 35 | `alt` en todas las imágenes | E | presentes |
| 36 | `alt` descriptivo, no decorativo | W | describe la imagen |
| 37 | Texto de enlace significativo | W | nunca "clic aquí" |
| 38 | Contenido principal en HTML | E | no inyectado por JS |

## Datos estructurados

| # | Comprobación | Sev. | Criterio |
|---|---|---|---|
| 39 | JSON-LD válido | E | parsea sin errores |
| 40 | `Person` con `name`, `jobTitle`, `url` | E | |
| 41 | `Person.sameAs` a perfiles reales | W | GitHub y LinkedIn |
| 42 | `WebSite` con `inLanguage` | E | `es` |
| 43 | `ProfilePage` en la home | W | |
| 44 | `CreativeWork` por proyecto con ruta | W | cuando existan rutas |
| 45 | Sin email ni teléfono en el schema | E | privacidad |
| 46 | Sin datos inventados | E | todo verificable |

## Rendimiento

| # | Comprobación | Sev. | Criterio |
|---|---|---|---|
| 47 | Lighthouse SEO móvil | E | 100 |
| 48 | LCP móvil | E | < 2.5 s |
| 49 | CLS | E | < 0.1 |
| 50 | Imágenes con dimensiones | W | sin layout shift |
| 51 | Fuentes sin FOIT prolongado | W | `font-display: swap` |

## Prohibido siempre

- Keyword stuffing.
- Texto oculto o `display:none` con contenido.
- Páginas doorway o contenido duplicado entre rutas.
- Schema con reseñas, notas o datos que no existen.
- Comprar enlaces o usar redes de enlaces.
- `noindex` olvidado tras un deploy de pruebas.
