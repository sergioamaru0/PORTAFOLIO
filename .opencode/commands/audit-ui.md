---
description: Matriz responsive, temas y accesibilidad en navegador real
agent: ui-tester
subagent: true
---

Audita la interfaz actual.

1. `npm run build` y `npm run preview` si no hay build reciente servido.
2. Recorre 320, 375, 768, 1024 y 1440 px en tema claro y tema oscuro.
3. Comprueba: overflow horizontal, solapamientos, contraste, foco visible, orden de
   tabulación, un solo `h1`, `prefers-reduced-motion`.
4. Ejecuta Lighthouse y anota Performance, Accessibility, LCP y CLS.
5. Guarda capturas y el informe en `docs/audits/YYYY-MM-DD-ui.md`.

Devuelve un resumen con severidad. No edites código.
