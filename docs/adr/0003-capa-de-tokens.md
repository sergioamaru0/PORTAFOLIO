# ADR-0003 — Capa de tokens y `src/styles/global.css`

- Fecha: 2026-11-13
- Estado: aceptada

## Contexto

La constitución prohíbe CSS global nuevo sin ADR y `AGENTS.md` exige tokens semánticos. Hoy el
sitio no tiene capa de tokens: 31 clases de paleta repartidas por los componentes y un
`background` fijo en `Layout.astro`. La spec 003 define la identidad visual y necesita un único
lugar donde vivan los colores y el tema.

## Decisión

Crear `src/styles/global.css` con:

- Variables HSL para el tema claro en `:root` y para el oscuro en `[data-theme="dark"]`.
- Su mapa en `tailwind.config.mjs` mediante `hsl(var(--token) / <alpha-value>)` y
  `darkMode: 'selector'`.
- Base mínima: `color-scheme`, familia tipográfica, foco visible, `prefers-reduced-motion` y
  `scroll-behavior`.

Ningún estilo de componente vive en el archivo global.

## Alternativas descartadas

- **Duplicar `dark:` en cada componente**: 31 focos de color y ninguna garantía de contraste.
- **Tokens con hex literales en `tailwind.config.mjs`**: impide cambiar de tema por atributo.
- **CSS por componente con `@apply`**: reparte la verdad del color en varios archivos.

## Consecuencias

- Un solo lugar declara color y tema; los componentes usan `bg-background`, `text-foreground` y
  compañía.
- `npm run lint:tokens` pasa a ser una puerta real: si un color no es token, falla.
- Coste: cada color nuevo exige tocar `global.css` y medir su contraste en ambos temas.
