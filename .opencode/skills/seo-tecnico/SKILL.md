---
name: SEO Técnico
description: Metadatos, datos estructurados, rastreo e indexación para un portafolio estático en Astro
---

# SEO Técnico

SEO verificable. Cada afirmación se comprueba con `scripts/audit-seo.mjs`, Lighthouse o
inspección del HTML construido.

## Principio

Un portafolio se posiciona por **persona + especialidad + ciudad**, no por palabras clave
repetidas. El objetivo es que alguien que busque "desarrollador fullstack Bogotá" o tu
nombre te encuentre, y que al entrar entienda en cinco segundos qué haces.

## Orden de trabajo

1. `site` en `astro.config.mjs`: sin dominio absoluto no hay canonical ni sitemap válidos.
2. Componente único de SEO (`src/components/Seo.astro`) con props tipadas.
3. Cada página declara su title, description y datos estructurados.
4. `robots.txt` y sitemap generados desde el propio sitio.
5. 404 real con status 404.
6. Auditoría: `npm run audit:seo:strict` + Lighthouse SEO.

## Metadatos

| Elemento | Regla |
|---|---|
| `<title>` | 30–60 caracteres, único, intención primero |
| `meta description` | 70–155 caracteres, con propuesta de valor, sin relleno |
| `link rel=canonical` | absoluto, autorreferente, sin parámetros |
| `og:title` / `og:description` | pueden diferir del title para redes |
| `og:image` | 1200×630, absoluta, con `og:image:alt` |
| `og:url` | igual al canonical |
| `og:type` | `website` o `profile` |
| `og:locale` | `es_CO` |
| `twitter:card` | `summary_large_image` |
| `html lang` | `es` |
| `theme-color` | coherente con el tema activo |

## Datos estructurados

JSON-LD en un `<script type="application/ld+json">`. Nunca microdata mezclada.

- `Person`: nombre, cargo,url, `sameAs` a perfiles reales, `address` a ciudad/país.
- `WebSite`: nombre, url, `inLanguage`.
- `ProfilePage`: envuelve el contenido del portafolio.
- `CreativeWork`: uno por proyecto publicado con ruta propia.

Prohibido: email y teléfono en el schema, reseñas inventadas, `aggregateRating` falso,
`Organization` que no existe.

## Rastreo e indexación

- `robots.txt` con `Allow: /` y la línea `Sitemap:` absoluta.
- Sitemap con todas las rutas públicas y sin las que llevan `noindex`.
- `404` con status HTTP 404 real, no un redirect a la home.
- PDFs y datos personales: `X-Robots-Tag: noindex, nofollow` o fuera del sitio.
- Sin `noindex` accidental en producción. Es el error más caro y el más silencioso.

## Rendimiento con impacto SEO

- LCP < 2.5 s en móvil. La imagen o el bloque de texto principal es el candidato.
- CLS < 0.1. Reserva espacio para imágenes y fuentes.
- Sin JS bloqueante en el `<head>` salvo el script de tema (< 1 KB).
- Imágenes con `astro:assets`, `width`/`height` y formato moderno.

## Contenido

- Un `h1` por página que diga quién eres y qué haces.
- Jerarquía `h2`/`h3` sin saltos.
- Texto real y verificable: tecnologías que usas, proyectos que existen, años reales.
- Enlaces con texto descriptivo. Nunca "clic aquí".
- `alt` que describa la imagen, no que repita el title.

## Verificación

```bash
npm run build
npm run audit:seo         # informe
npm run audit:seo:strict  # falla si hay errores
```

Referencias:

- `references/checklist.md` — checklist completo con criterio de aceptación.
- `references/schema-person.json` — plantilla JSON-LD.
- `references/titles-es.md` — patrones de title y description en español.
