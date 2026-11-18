---
name: Diseño Web
description: Sistema de diseño del portafolio con tokens semánticos, tipografía, espaciado y temas claro/oscuro
---

# Diseño Web

Guía de implementación visual. El objetivo no es "que se vea bien", es que sea coherente,
accesible y mantenible con tokens.

## Regla cero

**Solo tokens semánticos.** Ningún componente usa colores de paleta de Tailwind ni hex.

```astro
<!-- bien -->
<section class="bg-background text-foreground border-border">

<!-- mal -->
<section class="bg-white text-gray-900 border-gray-200">
```

Si un color no existe como token, se añade al tema con un ADR, no se improvisa en el markup.

## Tokens del proyecto

| Token | Uso |
|---|---|
| `background` / `foreground` | superficie base y texto principal |
| `surface` / `surface-foreground` | tarjetas, paneles elevados |
| `muted` / `muted-foreground` | fondos suaves y texto secundario |
| `primary` / `primary-foreground` | acción principal |
| `accent` / `accent-foreground` | énfasis, enlaces, badges |
| `border` | separadores y contornos |
| `ring` | foco visible |
| `destructive` | errores |

Se mapean en `tailwind.config.mjs` a `hsl(var(--token) / <alpha-value>)` y se declaran como
variables HSL en `src/styles/global.css`, una vez para claro y otra para oscuro.

## Contraste

Mínimo WCAG 2.2 AA:

- Texto normal: 4.5:1.
- Texto grande (≥ 24 px o ≥ 18.66 px en negrita): 3:1.
- Componentes de UI y estados de foco: 3:1.

Verifica con el valor HSL real, no a ojo. Un token que falla en un tema es un bug, no un
matiz.

## Tipografía

- Una sola familia para texto y otra para código, si hace falta.
- Escala limitada: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`,
  `text-4xl`. Sin valores arbitrarios salvo casos justificados.
- Longitud de línea de 45–75 caracteres en párrafos (`max-w-prose`).
- Interlineado mínimo 1.5 en texto corrido.

## Espaciado y layout

- Escala de 4 px: `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `24`.
- Contenedor con ancho máximo y padding lateral que no baje de 16 px en móvil.
- Sin `overflow-x` en `body`. Si algo se sale, se arregla el elemento, no se oculta.
- Grid o flex, nunca posicionamiento absoluto para layout.

## Temas

- `darkMode: 'selector'` en Tailwind; el tema se aplica con `data-theme` en `<html>`.
- Un único lugar declara los colores: `global.css`.
- Nada de `dark:` duplicando clases: si necesitas `dark:`, el token está mal elegido.
- `color-scheme` coherente con el tema para que los controles nativos acompañen.
- Sin transición de color si `prefers-reduced-motion: reduce`.

## Foco

- Foco visible siempre: `outline` o `ring` con contraste ≥ 3:1.
- Nunca `outline: none` sin sustituto.
- El orden de tabulación sigue el orden visual.

## Movimiento

- Duraciones 150–250 ms, `ease-out`.
- Anima `transform` y `opacity`, no `width`, `height` ni `top`.
- Todo movimiento respeta `prefers-reduced-motion`.

## Checklist antes de dar por bueno un componente

- [ ] Solo tokens semánticos.
- [ ] Contraste AA en claro y oscuro.
- [ ] Foco visible y operable con teclado.
- [ ] Sin overflow a 320 px.
- [ ] Textos en español, `alt` descriptivo si hay imagen.
- [ ] Sin JS de cliente si se puede resolver con CSS.
