---
description: Auditoría SEO técnica sobre el build
agent: seo-auditor
subagent: true
---

Audita el SEO técnico del sitio construido.

1. `npm run build`.
2. `npm run audit:seo` y `npm run audit:seo:strict`.
3. Revisa `dist/**/*.html`: title, description, canonical, Open Graph, Twitter Card,
   JSON-LD, `lang` y `h1` único.
4. Comprueba `sitemap`, `robots.txt` y la página 404.
5. Lighthouse SEO en móvil, en tema claro y en tema oscuro.
6. Guarda el informe en `docs/audits/YYYY-MM-DD-seo.md`.

Devuelve hallazgos por severidad con `archivo:línea`. No edites `src/`.
