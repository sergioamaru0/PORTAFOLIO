# Auditoría — Identidad visual (spec 003)

Build auditado: `dist/` local, `npm run build` en verde (0 errores, 2 hints preexistentes).
Herramienta: cálculo propio HSL → sRGB → luminancia relativa (WCAG 2.2), sin scripts nuevos en el
repo y **sin MCP** (Chrome DevTools y Netlify no están operativos).

Estado del informe: **parcial**. T3 cierra el contraste (RF-7). Las secciones de matriz de viewports,
tema, foco y presupuesto de JS las completa T16.

## Contraste de tokens (RF-7)

### Método

Para cada token se toma la tripleta HSL real de `src/styles/global.css`, se convierte a sRGB y se
calcula la luminancia relativa con la fórmula de WCAG 2.2:

```
L = 0.2126·R + 0.7152·G + 0.0722·B
  donde C = C/12.92 si C ≤ 0.03928, si no ((C + 0.055)/1.055)^2.4
ratio = (L_claro + 0.05) / (L_oscuro + 0.05)
```

Umbral: **4.5:1** para texto y **3:1** para interfaz (componentes no textuales y foco).

### Tema claro

| Par | Primer plano | Fondo | Ratio | Umbral | Veredicto | Uso |
|---|---|---|---|---|---|---|
| `foreground` / `background` | `#16181D` | `#FBFAF9` | **17.05** | 4.5 | ✅ | texto principal |
| `muted-foreground` / `background` | `#5D636F` | `#FBFAF9` | **5.81** | 4.5 | ✅ | texto secundario |
| `muted-foreground` / `muted` | `#5D636F` | `#F2F1ED` | **5.34** | 4.5 | ✅ | secundario sobre superficie suave |
| `primary` / `background` | `#147169` | `#FBFAF9` | **5.64** | 4.5 | ✅ | enlaces y acento |
| `primary-foreground` / `primary` | `#FFFFFF` | `#147169` | **5.86** | 4.5 | ✅ | texto sobre botón primario |
| `ring` / `background` | `#147169` | `#FBFAF9` | **5.64** | 3.0 | ✅ | anillo de foco |
| `destructive` / `background` | `#AD1F1F` | `#FBFAF9` | **6.74** | 4.5 | ✅ | mensajes de error |
| `border` / `background` | `#E2E0DA` | `#FBFAF9` | 1.27 | 3.0 | ⚠️ decorativo | separadores, no es señal única |

### Tema oscuro

| Par | Primer plano | Fondo | Ratio | Umbral | Veredicto | Uso |
|---|---|---|---|---|---|---|
| `foreground` / `background` | `#F6F6F3` | `#0D0F12` | **17.74** | 4.5 | ✅ | texto principal |
| `muted-foreground` / `background` | `#9FA3AD` | `#0D0F12` | **7.64** | 4.5 | ✅ | texto secundario |
| `muted-foreground` / `muted` | `#9FA3AD` | `#1F2228` | **6.30** | 4.5 | ✅ | secundario sobre superficie suave |
| `primary` / `background` | `#47D1BF` | `#0D0F12` | **10.22** | 4.5 | ✅ | enlaces y acento |
| `primary-foreground` / `primary` | `#101318` | `#47D1BF` | **9.87** | 4.5 | ✅ | texto sobre botón primario |
| `ring` / `background` | `#47D1BF` | `#0D0F12` | **10.22** | 3.0 | ✅ | anillo de foco |
| `destructive` / `background` | `#E06C6C` | `#0D0F12` | **5.97** | 4.5 | ✅ | mensajes de error |
| `border` / `background` | `#2D3139` | `#0D0F12` | 1.47 | 3.0 | ⚠️ decorativo | separadores, no es señal única |

### Conclusión de contraste

Los **seis pares exigidos** por la spec pasan en ambos temas, el más ajustado con 5.34:1
(`muted-foreground` sobre `muted` en claro). Ningún token necesita corrección, así que
`global.css` no se toca en esta tarea.

`border` queda por debajo de 3:1 en los dos temas **a propósito**: la spec lo declara decorativo y
prohíbe que sea la única señal de un control. Cualquier límite que identifique un campo, un botón o
un estado usa `ring` o `primary`, que sí superan 3:1. Si en una tarea futura un borde pasa a ser la
única señal, hay que cambiarlo a `ring`, no subir el contraste de `border` (rompería el aspecto
plano de «tinta y papel»).

## Pendiente en este informe (T16)

- Matriz manual de 5 anchos (320, 375, 768, 1024, 1440) × 2 temas, sin overflow.
- `color-scheme` calculado, ausencia de flash con tema guardado y `prefers-reduced-motion`.
- Foco visible por teclado y áreas de 44 × 44 px.
- Presupuesto de JavaScript de cliente medido sobre el HTML emitido.
- Tabla RF-1 a RF-23 con evidencia, y deuda de verificación (Lighthouse, LCP, matriz automática).

---

# Cierre de la spec 003 (T16)

Build: `dist/` local, `npm run build` en verde (0 errores, 2 hints preexistentes de la spec 002).
Fecha: 2026-11-16.

## Estado de la verificación en navegador

**Bloqueada, y declarada como deuda.** Chrome DevTools MCP está configurado pero busca Chrome en
rutas donde no existe: en esta máquina solo hay Edge y Brave. `brave.exe --headless --screenshot`
también se cuelga, así que no hay renderizado real disponible. Todo lo que sigue está verificado
sobre el **HTML y el CSS emitidos**, no sobre una captura. Lo que exige píxeles se marca como
pendiente; nada se declara en verde sin haberse medido.

## Requisitos, uno a uno

| RF | Qué pide | Evidencia | Estado |
|---|---|---|---|
| RF-1 | Tema del sistema sin preferencia | `@media (prefers-color-scheme: dark)` presente en el CSS emitido (1) con `:root:not([data-theme="light"])` | ✅ |
| RF-2 | Persistir la elección | Script de `Layout` lee `localStorage.theme`; `ThemeToggle` escribe en `try/catch` | ✅ |
| RF-3 | Seguir el sistema sin recargar | `matchMedia('(prefers-color-scheme: dark)')` + listener `change` en el toggle | ✅ |
| RF-4 | `color-scheme` por tema | CSS emitido: `color-scheme:light` (1) y `color-scheme:dark` (2, media + atributo) | ✅ |
| RF-5 | Sin flash antes del primer pintado | Script inline en el `<head>`, sin `src` ni `type="module"`, emitido antes del `<link rel="stylesheet">` | ✅ (por orden de bloques; no capturado) |
| RF-6 | `prefers-reduced-motion` | `@media (prefers-reduced-motion: reduce)` con `scroll-behavior:auto` y `transition:none` | ✅ |
| RF-7 | Contraste AA | Tabla de arriba: 6 pares exigidos × 2 temas, mínimo 5.34:1 | ✅ |
| RF-8 | `theme-color` al cambiar de tema | 1 `<meta name="theme-color">` en el `<head>`; el script y el toggle lo actualizan | ✅ |
| RF-9 | Selector de 2 estados, teclado y lector | 1 `role="switch"`, `aria-checked` renderizado en servidor y sincronizado | ✅ |
| RF-10 | Solo tokens en components/layouts/pages | `npm run lint:tokens` → «OK — sin colores de paleta en componentes» | ✅ |
| RF-11 | Superficies planas, sin degradados ni hex | `gradient` en `src/components`, `src/layouts`, `src/pages` → 0. Los `<linearGradient>` de `src/assets/icons/` son SVG de marca, no superficies | ✅ |
| RF-12 | Un solo acento | `primary` solo en enlaces, `Badge` y foco; el resto es la escala neutra | ✅ |
| RF-13 | Contenedor 768 px y 16 px | `max-w-3xl px-4` en `Header`, `SectionContainer` y `Footer` | ✅ |
| RF-14 | Escala de 4 px y tipográfica | `mt-15`/`mb-15` eliminados (no existían); cero `-[…]` en los tres directorios | ✅ |
| RF-15 | Experiencia en 2 columnas desde 768 | `md:grid md:grid-cols-3` con `<time>` en una columna y `md:col-span-2` | ✅ en código; **sin captura** |
| RF-16 | Proyectos en rejilla desde 1024 | `grid gap-8 lg:grid-cols-2`, `<Image>` con `aspect-video object-cover` | ✅ en código; **sin captura** |
| RF-17 | Hero coherente | 1 `<h1>`, rol y localidad en `<p>`; la cifra sigue diciendo «+1 año» (la corrige la 002) | ⚠️ parcial por diseño |
| RF-18 | Tipografía del sistema | `ui-sans-serif` en el CSS emitido; `font-mono` en `<time>` y etiquetas; 0 fuentes web | ✅ |
| RF-19 | Foco visible 2 px | `outline:2px` + `outline-offset:2px` en el CSS emitido; ningún componente lo redefine | ✅ en CSS; **sin captura** |
| RF-20 | `lang="es"` y texto en español | `<html lang="es">`; `Experiancia`, `GutHub`, `Bogota, co` corregidos | ✅ |
| RF-21 | Skip link primero | `<a href="#contenido">Saltar al contenido</a>` es el primer hijo del `<body>`; 1 `<main id="contenido" tabindex="-1">` | ✅ |
| RF-22 | `alt` descriptivo | 3 `<img>`, 0 `alt=""`, 0 `[object`; los `alt` salen de los datos | ✅ |
| RF-23 | Área mínima 44 × 44 | `min-h-11` en enlaces del `Header`, píldoras, «Saber más» y «Ver proyecto» | ⚠️ ver nota |

**Nota de RF-23:** el skip link mide 40 px de alto (`px-4 py-2`) y es el único interactivo sin
`min-h-11`. Queda como residuo conocido para la spec 004 o un `/cambio`.

**Nota de RF-17:** el hero ya no contradice la cronología en su composición, pero el literal
«+1 año de experiencia» sigue ahí a propósito: lo sustituye `experienceYearsLabel()` en la 002.

## Presupuesto de JavaScript (RNF-2)

Medido sobre `dist/index.html`, gzip nivel óptimo, sin contar atributos de etiqueta:

| Script | Crudo | gzip | Origen |
|---|---|---|---|
| Tema (aplicar antes del pintado) | 271 B | 203 B | spec 003 · T5 |
| Selector de tema | 1 266 B | 556 B | spec 003 · T6 |
| **Subtotal de la 003** | **1 537 B** | **759 B** | — |
| Copiar correo al portapapeles | 1 437 B | 640 B | **spec 002, preexistente** |
| **Total** | 2 974 B | **1 399 B** | — |

RNF-2 pide menos de 1.5 KB comprimido para tema y selector: **759 B**, la mitad del presupuesto.
Incluso contando el script heredado de la 002, el total (1 399 B) sigue por debajo. **Cero scripts
externos**: no hay ningún `src="/_astro/*.js"` en el documento.

## Superficies y ausencias comprobadas

- CSS emitido: 11 697 B, un solo archivo, sin utilidades de paleta (`bg-gray-*`, `text-white`,
  `bg-violet-*`…).
- `dark:` en `src/components`, `src/layouts`, `src/pages`: **0**.
- `style=` en los mismos tres directorios: **0**.
- Hex arbitrarios `[#` y valores `-[`: **0**.
- `alt` con `[object`: **0**.
- `lint:tokens`: **0 violaciones** (partía de 31).
- `npm run audit:seo`: 15 errores y 2 avisos, **todos de la spec 004** (title, description,
  canonical, Open Graph, JSON-LD, sitemap, robots, 404). `lang` y `h1` ya no aparecen.

## Deuda de verificación (lo que NO está hecho)

1. **Matriz de 5 anchos × 2 temas sin overflow.** Requiere renderizado. Se razona por clases
   (ningún elemento con ancho fijo supera los 288 px útiles a 320 px, y todo lo ancho usa
   `max-w-*`, `flex-wrap` o `min-w-0`), pero **no se ha medido**.
2. **Lighthouse Accessibility ≥ 95 y LCP < 2.5 s.** Requiere navegador.
3. **`color-scheme` calculado, foco real por teclado, ausencia de flash con tema guardado.**
   Verificado en el código y en el orden de bloques, no en ejecución.
4. **Imágenes optimizadas:** 9 variantes emitidas (3 del avatar, 6 de proyectos). Sin medir el
   peso real servido en 4G.

## Límites conocidos y aceptados

- Sin JavaScript, el `aria-checked` del selector dice «desactivado» aunque el sistema esté en
  oscuro. El tema se sigue aplicando bien porque lo resuelve el CSS.
- El `theme-color` por defecto es el del tema claro; sin JS y con sistema oscuro, la barra del
  navegador móvil queda en claro.
- `#FBFAF9` y `#0D0F12` aparecen en dos archivos (`Layout.astro` y `ThemeToggle.astro`) porque el
  script no puede leer variables CSS antes de que se aplique la hoja. Unificarlo exige otra
  estrategia (variables en `:root` leídas con `getComputedStyle`, que fuerza layout) y no compensa
  por 2 constantes.

## Residuo abierto

- `src/components/Card.astro` fue eliminado en T15: era huérfano y portaba la última `gradient`
  CSS. Borrado del working tree, recuperable desde git.
- `src/assets/icons/Nextjx.astro:4` conserva `style="mask-type:alpha"` en un `<mask>` SVG. Está
  fuera del ámbito de la spec (assets de marca, no componentes).

