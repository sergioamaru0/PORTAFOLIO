# Plan 003 — Identidad visual

Spec: `specs/003-identidad-visual/spec.md`
Estado: borrador (listo para aprobación de Sergio)
Fecha: 2026-11-13
Actualizado: 2026-11-17 — añade la fase 2 (CR-1 a CR-7, RF-24 a RF-44) y las tareas T17–T30.
Las decisiones D1–D12 y el orden de implementación de 2026-11-13 quedan como historia y **no** se
reescriben: describen la fase 1, ya implementada y auditada.

## Enfoque

Una sola capa de tokens manda. `src/styles/global.css` declara los colores como tripletas HSL
(las de la tabla de la spec, sin reinterpretarlas), `tailwind.config.mjs` los expone como clases
semánticas y ningún componente vuelve a nombrar un color. El tema se resuelve por CSS
(`prefers-color-scheme` para el sistema, `[data-theme]` para la preferencia explícita) y un script
inline bloqueante de menos de 300 bytes en `<head>` solo escribe el atributo antes del primer
pintado; el selector de dos estados y la sincronización de `aria-checked` y `theme-color` son lo
único que queda en cliente. La composición se reescribe con las utilidades de Tailwind que ya
existen (`max-w-3xl`, `grid`, `aspect-video`, `min-h-11`), sin valores arbitrarios, sin fuentes web
y sin dependencias nuevas.

Todo el trabajo es de presentación: los datos de experiencia no se tocan (son de la 002), la hoja
de vida y el correo no se arreglan (002) y el SEO no se toca salvo `lang`, `title` y `theme-color`
(004).

## Módulos y archivos afectados

| Archivo | Cambio | RF que cubre |
|---|---|---|
| `src/styles/global.css` (nuevo) | Tokens de la tabla de la spec en `:root` (claro), `[data-theme="dark"]` y bloque `@media (prefers-color-scheme: dark)` para el caso sin JS; base mínima del ADR-0003: `color-scheme`, familias tipográficas, foco `outline` de 2 px con `outline-offset` 2 px, `scroll-behavior`, `prefers-reduced-motion`, transición de color de 150 ms | RF-4, RF-6, RF-7, RF-10, RF-11, RF-12, RF-18, RF-19, RNF-5, RNF-6 |
| `tailwind.config.mjs` | `darkMode: ['selector', '[data-theme="dark"]']`; `theme.extend.colors` con los 10 tokens en `hsl(var(--token) / <alpha-value>)`; `fontFamily.sans`/`mono` con las pilas del sistema | RF-10, RF-12, RF-18 |
| `src/layouts/Layout.astro` | Importa `global.css`; se borra el `<style is:global>` y los dos divs de degradado; `lang="es"`; `viewport` sin `maximum-scale`; script de tema inline bloqueante; `<meta name="theme-color">`; skip link como primer elemento; `<main id="contenido" tabindex="-1">` único; `body` con `min-h-dvh flex flex-col bg-background text-foreground` | RF-1, RF-2, RF-4, RF-5, RF-8, RF-11, RF-20, RF-21, RF-23, RNF-3, RNF-5 |
| `src/components/ThemeToggle.astro` (nuevo) | `<button role="switch">` de dos estados, texto visible, `aria-checked` sincronizado, script inline que persiste en `localStorage`, escucha `matchMedia` y `storage` y actualiza `theme-color` | RF-2, RF-3, RF-8, RF-9, RF-23 |
| `src/components/Header.astro` | `<header>` con el contenedor de 768 px, `nav` con anclas a ids existentes, `ThemeToggle` al final, `min-h-11` en cada enlace | RF-13, RF-19, RF-20, RF-23 |
| `src/components/SectionContainer.astro` | Corrige `class=` + plantilla sin llaves a `class:list`; `mx-auto w-full max-w-3xl px-4`; quita `font-mono` de la sección | RF-13, RF-14 |
| `src/components/Badge.astro` | `inline-flex items-center rounded-full border border-primary px-3 py-1 text-sm font-medium text-primary`; deja de ser interactivo | RF-11, RF-12, RF-14, RF-17, RF-23 |
| `src/components/SocialPill.astro` | Tokens (`bg-muted`, `text-foreground`, `border-border`), `min-h-11`, quita `hover:scale-110`; `rel="noopener noreferrer"` (hoy `nooper nofer`); `target`/`rel` solo si no hay `download` | RF-11, RF-19, RF-23 |
| `src/components/SocialPilllMail.astro` | Solo clases: tokens, `min-h-11`, foco heredado. El `<script>` de copiar al portapapeles no se toca (002) | RF-11, RF-19, RF-23 |
| `src/components/Footer.astro` | Pasa de `<div class="h-20">` a `<footer>` con `border-t border-border` y padding vertical; sin texto nuevo | RF-11, RF-21 (landmarks) |
| `src/components/Experience.astro` | `<ol>` sin `border-s` ni `ml-3`; `divide-y divide-border`; separación con `space-y-8` | RF-11, RF-15 |
| `src/components/ExperienceItem.astro` | Elimina el punto absoluto de la línea de tiempo; rejilla `md:grid-cols-3` (periodo 1 columna, contenido 2) con `min-w-0` y `break-words`; `<time>` en monoespaciada `text-muted-foreground`; cargo en `text-foreground`; «Saber más» con tokens y `min-h-11`. **Props intactas** | RF-11, RF-12, RF-14, RF-15, RF-18, RF-19, RF-23 |
| `src/components/Projects.astro` | Rejilla `grid gap-8 lg:grid-cols-2`; `<Image>` de `astro:assets` en `aspect-video object-cover`; enlace como texto bajo la imagen (sin `absolute` ni overlay); tags con tokens; `alt` desde los datos; corrige `<aticle>` y `style="margin-top: 100px"` | RF-11, RF-12, RF-14, RF-16, RF-22, RNF-3, RNF-4 |
| `src/pages/index.astro` | Hero: un solo `h1` con el nombre, rol en `<p>`, disponibilidad como `Badge` estático, pills de contacto; se elimina el `<main>` anidado; avatar con `Image` y `alt` descriptivo; ids `#experiencia` y `#proyectos`; erratas («Experiancia», «GutHub», «De Bogota, co Colombia») | RF-13, RF-14, RF-17, RF-20, RF-22, RNF-3 |
| `scripts/check-contrast.mjs` (nuevo, propuesta) | Lee los tokens de `global.css` con regex, convierte HSL→sRGB→luminancia relativa y comprueba los pares realmente usados en ambos temas | RF-7, RNF-1 (verificación) |
| `package.json` | Añade `"lint:contrast": "node scripts/check-contrast.mjs"`. Ninguna dependencia nueva | RF-7 |
| `docs/audits/2026-11-13-identidad-visual.md` (nuevo) | Informe con la tabla de validación de la spec, capturas y comandos exactos | Criterios de finalización |
| `docs/memoria.md` | Foco, decisiones y deuda al cerrar | Flujo SDD |

Consumidores verificados: `SectionContainer` solo lo usa `index.astro`; `Badge` solo el hero;
`SocialPill` el hero; `ExperienceItem` solo `Experience.astro`. `src/components/Card.astro` no lo
importa nadie (ver hallazgos colaterales).

## Modelo de datos

No aplica: sitio estático.

Contrato congelado por esta spec, por exigencia explícita de la 002:

```ts
// src/components/ExperienceItem.astro — sin cambios en este plan
interface Props { title: string; description: string; link?: string; date: string; dowload?: string }
```

La 002 cambiará esas props (`role`, `company`, `start`, `end`, `summary`, `certificate`) y el
`datetime` de `<time>`. Aquí solo cambia el marcado que las consume. Lo único que este plan añade a
un array de datos es el campo `alt` de `PROJECTS` en `Projects.astro`, que no forma parte del modelo
de experiencia y es obligatorio por RF-22 (hoy el `alt` se genera a partir del objeto imagen).

## Decisiones técnicas

### D1 — `data-theme` en `<html>`, con el tema oscuro declarado dos veces en CSS

- Motivo: RF-10 y el ADR-0003 fijan `[data-theme="dark"]`; y RNF-5 exige que sin JavaScript se vea
  el tema del sistema, cosa que solo puede hacer una media query. Se combinan así:
  `:root` (claro) · `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { …oscuro } }`
  · `[data-theme="dark"] { …oscuro }`. La preferencia explícita gana siempre al sistema porque el
  selector con atributo es más específico y anula la media query vía `:not`.
- Alternativa descartada: clase `.dark`. Es el valor por defecto de Tailwind y funciona, pero deja
  el tema como una clase de presentación en el mismo espacio que las utilidades, se puede pisar por
  accidente con `class:list` y no coincide con lo que ya está escrito en el ADR-0003 y en la skill.
  También se descartó `light-dark()`: exigiría que `--token` fuera un color completo y rompería
  `hsl(var(--token) / <alpha-value>)`, que es lo que da las variantes con alpha.
- Consecuencia: el bloque de valores oscuros aparece duplicado (~11 líneas). Coste aceptado y
  anotado en `global.css` con un comentario que remite a la tabla de la spec; cualquier token nuevo
  se edita en tres sitios y `lint:contrast` falla si uno queda desincronizado.

### D2 — Script de tema inline y bloqueante en `<head>`; nada de módulo

- Motivo: RF-5 prohíbe el flash. Un `<script>` normal de Astro se emite como módulo `_astro/*.js`
  diferido: se ejecuta después del primer pintado y garantiza el destello claro→oscuro. El inline
  corre antes de que exista `<body>`. Contrato mínimo: leer `localStorage.theme`, aceptar solo
  `"light"` o `"dark"`, escribir `documentElement.dataset.theme` y, si hay preferencia, el
  `content` de `theme-color`. Todo dentro de `try/catch` (RF: `localStorage` bloqueado).
- Alternativa descartada: módulo externo con caché. Ahorra ~200 bytes de HTML pero llega tarde; el
  flash es un fallo visible y verificable, la caché no compensa. También se descartó resolver el
  tema en el servidor: el sitio es estático y no hay cookie ni backend.
- Consecuencia: `astro check` **no** valida el interior de un `<script is:inline>` (no es TS). Se
  compensa con tres reglas: menos de 300 bytes, sin lógica de presentación, y revisión manual
  línea a línea anotada en el informe. El script no aplica el tema del sistema: eso lo hace el CSS
  de D1, así que RF-3 (seguir `prefers-color-scheme` sin recargar) se cumple sin JavaScript.

### D3 — Tokens en tripletas HSL, nunca hex en la configuración

- Motivo: RF-10 y ADR-0003. Una tripleta permite `hsl(var(--background) / 0.5)` y
  `<alpha-value>`, y un único `[data-theme]` cambia los 10 colores a la vez.
- Alternativa descartada: hex en `tailwind.config.mjs`. Es lo que ya intenta la deuda actual con
  `dark:bg-[#ddca8b]`: obliga a duplicar cada color por tema en el markup y hace imposible el
  cambio por atributo. También se descartó nombrar los tokens por apariencia (`bg-gray-100`): el
  componente volvería a decidir color.
- Consecuencia: `npm run lint:tokens` pasa a ser una puerta real. Ojo con el detalle de
  implementación: la regex del script mira la línea completa, no solo el atributo `class`, así que
  tampoco se puede escribir `bg-black` en un comentario ni en un string de plantilla.

### D4 — `darkMode: ['selector', '[data-theme="dark"]']` aunque no se use `dark:`

- Motivo: la forma de array es la única que hace que un `dark:` futuro apunte a
  `[data-theme="dark"]`; `darkMode: 'selector'` a secas busca `.dark` y quedaría mintiendo respecto
  a la skill y al ADR.
- Alternativa descartada: omitir `darkMode` (valor por defecto `media`). Funcionaría por
  casualidad mientras no exista ningún `dark:`, pero cualquier `dark:` que alguien escriba pasaría
  a ignorar la preferencia explícita del visitante.
- Consecuencia: la configuración queda vestigial y documentada como tal; la regla real es «cero
  `dark:` en componentes», verificable con un `grep`.

### D5 — Sin fuentes web: pilas del sistema declaradas una vez en Tailwind

- Motivo: RF-18 y RNF-1. `ui-sans-serif, system-ui, …` y `ui-monospace, SFMono-Regular, …` no
  generan peticiones, no provocan FOUT ni CLS (RNF-3) y no añaden dependencias.
- Alternativa descartada: una variable font autoalojada (p. ej. Inter). Es la mejora estética más
  obvia, pero cuesta entre 20 y 90 KB, obliga a `font-display` y a precarga, introduce CLS y exige
  un ADR por dependencia. Queda como decisión futura de Sergio, no de este plan.
- Consecuencia: la jerarquía se construye con tamaño, peso, `letter-spacing: -0.02em` en títulos y
  `line-height` 1.1 / 1.6, no con la familia. La monoespaciada solo para fechas y etiquetas
  (`font-mono`), lo que da el aire «tinta y papel» sin descargar nada.

### D6 — Proyectos en rejilla con el enlace como texto, sin overlay

- Motivo: RF-16 y la decisión cerrada. El overlay actual (`<h2 class="absolute …">` sobre la imagen)
  rompe el orden de lectura, hace que el foco caiga sobre un elemento flotante y produce un enlace
  cuyo nombre accesible es «ir a proyecto» sin decir de qué proyecto.
- Alternativa descartada: mantener el overlay y solo recolorearlo. Es menos trabajo, pero conserva
  el problema de accesibilidad y de contraste (texto sobre imagen, imposible de medir con tokens).
- Consecuencia: la tarjeta es una `<article>` con imagen, título, descripción, tags y un enlace de
  texto «Ver proyecto de Clima App»; el nombre accesible nombra el proyecto. La imagen usa
  `aspect-video` (utilidad con nombre, no arbitraria) con `object-cover`, y `<Image>` emite
  `width`/`height` para que el CLS sea 0.

### D7 — Skip link además de los landmarks

- Motivo: RF-21 lo pide literalmente como primer elemento enfocable. Los landmarks (`header`,
  `main`, `footer`) resuelven a quien usa lector de pantalla, pero no a quien navega solo con
  teclado y tiene que atravesar la navegación en cada visita.
- Alternativa descartada: solo landmarks. Es cero marcado extra, pero deja sin cumplir RF-21 y sin
  atajo a los usuarios de teclado. También se descartó un skip link siempre visible: añade ruido
  permanente y compite con el `h1`.
- Consecuencia: `<a href="#contenido" class="sr-only focus:not-sr-only …">` como primer hijo del
  `body`, y `main` con `id="contenido"` y `tabindex="-1"` (sin `tabindex`, Safari no mueve el foco).
  El foco del skip link se ve con el `outline` global de D8, sin clases propias.

### D8 — Foco declarado una vez en `global.css`, no repetido por componente

- Motivo: RF-19 pide 2 px + 2 px en **todo** interactivo. Un `:focus-visible` global con
  `outline: 2px solid hsl(var(--ring)); outline-offset: 2px` lo garantiza por construcción, incluido
  el skip link y los enlaces que nadie recuerde estilizar.
- Alternativa descartada: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
  en cada componente. Es la forma Tailwind canónica, pero son cinco clases por elemento, fáciles de
  olvidar, y `ring-offset-background` necesita el token correcto en cada superficie.
- Consecuencia: excepción al «todo con utilidades», justificada por el ADR-0003 (el foco figura en
  la base mínima). Un componente que necesite otro foco lo sobrescribe explícitamente, y se nota en
  el diff.

### D9 — El tema no anima al cargar; transición de 150 ms solo entre estados

- Motivo: RF-6 existe porque hay transición de color, y a la vez RNF-3 exige CLS 0 y RF-5 exige cero
  flash. Las transiciones de CSS no se disparan en la primera resolución de estilo (no hay estilo
  anterior), así que una `transition: background-color, color, border-color 150ms ease-out` en la
  base es segura y da el cambio suave al pulsar el selector.
- Alternativa descartada: `transition` en cada componente con `duration-200`. Multiplica la
  declaración y hace fácil olvidar el guard de `prefers-reduced-motion`. También se descartó no
  animar nada: cumpliría RF-6 de forma vacía, pero la spec describe una transición que existe.
- Consecuencia: un único bloque `@media (prefers-reduced-motion: reduce)` que pone
  `transition: none` y `scroll-behavior: auto`. La transición nunca cubre `transform` ni opacidad de
  hover (se elimina `hover:scale-110` de `SocialPill`).

### D10 — Selector de dos estados con `role="switch"` y `aria-checked`, sin iconografía nueva

- Motivo: RF-9 exige estado anunciado. `switch` + `aria-checked` es exactamente un control de dos
  estados y se anuncia como «Tema oscuro, interruptor, desactivado». La spec deja la iconografía
  nueva fuera de alcance, así que la señal visual es texto.
- Alternativa descartada: dos botones (claro/oscuro) con `aria-pressed`. Es más explícito, pero
  duplica objetivos táctiles, permite el estado «ninguno pulsado» y ocupa el doble en móvil.
  También se descartaron iconos de sol y luna: son assets nuevos y la spec los excluye.
- Consecuencia: el botón se renderiza en el servidor con `aria-checked="false"`; el script del
  componente lo sincroniza al cargar. Sin JavaScript el control es inerte pero visible, que es el
  caso límite aceptado por la spec; el estado anunciado en ese escenario puede no coincidir con el
  tema del sistema y se declara como límite conocido en el informe.

### D11 — Verificación determinista con `lint:tokens`, un script de contraste y `grep`

- Motivo: los criterios de finalización exigen contraste medido «con el valor HSL real» y cero
  valores arbitrarios. Eso es aritmética y búsqueda de texto: se puede automatizar sin navegador.
- Alternativa descartada: comprobar el contraste a ojo o con una herramienta web puntual. No es
  repetible y no detecta la deriva cuando alguien añade un token. También se descartó un script que
  duplique los valores HSL: leerlos de `global.css` mantiene una sola fuente de verdad.
- Consecuencia: `scripts/check-contrast.mjs` sin dependencias (HSL→sRGB→luminancia→ratio) y
  `npm run lint:contrast`, en la línea de `check-tokens.mjs` y `audit-seo.mjs`. **Requiere
  aprobación de Sergio** porque añade un archivo y una entrada en `package.json` fuera de la lista
  de archivos de esta spec; si se rechaza, la misma comprobación queda como comando documentado de
  una sola ejecución y el criterio de finalización se cumple igual, con menos garantía futura.
  Los pares medidos no son solo «contra `background`»: `muted-foreground` sobre `muted` da un ratio
  algo menor que el 5.81 de la tabla (estimado ~5.3) y hay que confirmarlo, no suponerlo.

### D12 — La capa de tokens no espera a la 002, y la 002 tendrá que revisar su plan

- Motivo: la memoria fija el orden 003 → 002. `ExperienceItem` conserva aquí sus props actuales y
  solo cambia de piel; cuando la 002 cambie las props, el marcado ya estará tokenizado.
- Alternativa descartada: implementar la 002 primero y tokenizar después. Ahorraría reescribir el
  componente dos veces, pero deja el sitio con `lint:tokens` en rojo durante dos specs y obliga a
  tocar `index.astro` dos veces (hero y hoja de vida).
- Consecuencia: el plan de la 002 queda parcialmente obsoleto — su D10 («conservar las clases de
  paleta literalmente, criterio: no aumentar el conteo») y su R4 pierden sentido cuando los tokens
  existen. El orquestador debe regenerar o corregir `specs/002-experiencia-laboral/plan.md` con
  `/cambio` antes de `/tareas 002`. Se anota como dependencia, no se toca aquí.

## Dependencias con otras specs

- **002 — experiencia laboral (después).** Este plan no toca datos ni PDFs. La cifra «+1 año de
  experiencia» se mueve de sitio en el hero pero su literal **no se corrige aquí**: RF-17 solo
  prohíbe presentar cifras que contradigan la cronología en la *composición*; el valor lo arregla la
  002 (su RF-8 y su helper `experienceYearsLabel()`). El hueco queda idéntico al actual, en el mismo
  `<span>`, para que la 002 lo sustituya con una interpolación y no con un rediseño.
- **004 — SEO (después).** Aquí solo se toca `lang`, `title` y `theme-color`. `canonical`, Open
  Graph, JSON-LD, sitemap y `robots.txt` no se añaden, y `audit:seo:strict` sigue en rojo por diseño.

## Estrategia de verificación

Sin MCP: Netlify y Chrome DevTools no están operativos. Nada de Lighthouse ni de matriz automática
de viewports; eso se declara como manual y pendiente, no como hecho.

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Tipos | `npm run check` | Props tipadas de todos los componentes, imports de `astro:assets`, `class:list`, ausencia de usos con props viejas. **No** valida el interior de los `<script is:inline>` |
| Build | `npm run build` | HTML final con `lang="es"`, `data-theme` posible, `theme-color`, un solo `<main>`, `<Image>` con `width`/`height`, CSS de tokens emitido, cero degradados en el bundle |
| Determinista | `npm run lint:tokens` | RF-10: verde, hoy 31 violaciones a cero |
| Determinista | `npm run lint:contrast` (D11) | RF-7: los pares usados en ambos temas ≥ 4.5:1 (texto) y ≥ 3:1 (interfaz) |
| Determinista | `grep` documentados | RF-11: `grep -rn "gradient" src/` vacío y `grep -rn -- "bg-\[#\|text-\[#" src/` vacío. RF-14: `grep -rn -- "-\['" src/components src/layouts src/pages` vacío (valores arbitrarios) y `grep -rn "style=" src/components src/layouts src/pages` vacío. RF-12: `grep -rn "dark:" src/components src/layouts src/pages` vacío. RF-20: `grep -o 'lang="[a-z]*"' dist/index.html`. RF-22: `grep -o 'alt="[^"]*"' dist/index.html` y comprobación de que ninguno contiene `[object` ni el nombre del asset |
| Manual documentada | revisión con capturas en `docs/audits/2026-11-13-identidad-visual.md` | RF-1 a RF-9 y RF-13, 15 a 19, 21, 23: tema del sistema, persistencia, `color-scheme` calculado, ausencia de flash con recarga forzada y red limitada, `prefers-reduced-motion`, tabulación completa en ambos temas, contenedor a 1440 px, experiencia a 768/375 px, proyectos a 1024/1440 px, zoom 200 %, JS deshabilitado, `localStorage` bloqueado, dos pestañas |
| Pendiente (bloqueado) | Chrome DevTools MCP / Lighthouse | Matriz de 5 anchos × 2 temas sin overflow, Lighthouse Accessibility ≥ 95 y LCP < 2.5 s de los criterios de finalización. Se registran como deuda de verificación hasta que el MCP vuelva |

Verificaciones negativas, temporales y revertidas antes del cierre:

- RF-5: guardar tema oscuro, recargar con caché deshabilitada y limitación de red, capturar que no
  hay destello; revertir el estado de `localStorage`. Se registra captura y `git diff` limpio.
- RF-3: sin preferencia guardada, cambiar la emulación de `prefers-color-scheme` con el sitio
  abierto y comprobar que cambia sin recargar (lo hace el CSS de D1).
- RF-19: tabular por todos los interactivos en ambos temas y comprobar el anillo de 2 px con 2 px de
  separación, incluido el skip link.

## Riesgos

- **R1 · Flash de tema.** Si el script deja de ser inline, si se mueve detrás del `<body>` o si
  Astro lo convierte en módulo, el usuario con tema oscuro ve un destello claro. → Mitigación: D2
  con `is:inline` en `<head>`, comprobación en el HTML de `dist/` de que el script aparece antes de
  `</head>` (`grep -c` sobre el build), y la verificación negativa de RF-5 con red limitada. Si
  apareciera un flash residual, la contingencia es añadir `visibility: hidden` al `body` hasta
  `data-theme-ready`, lo que no se hace de entrada porque penaliza el LCP.
- **R2 · CLS por imágenes o por el tema.** Las imágenes actuales usan `image.src` sin dimensiones y
  el avatar no las declara. → Mitigación: `<Image>` de `astro:assets` en proyectos y avatar
  (`width`/`height` emitidos), `aspect-video` con `object-cover`, cero fuentes web (D5) y ningún
  cambio de layout entre temas (los tokens solo cambian color). Se mide a mano en DevTools una vez
  esté disponible.
- **R3 · Contraste en hover.** Recolorear en hover es la forma más fácil de romper AA: un
  `hover:text-primary/70` sobre `muted` cae por debajo de 4.5:1. → Mitigación: regla explícita —
  ningún token con alpha detrás de texto, el alpha solo en bordes decorativos; el hover cambia
  `background-color` de superficies medidas o añade subrayado, nunca baja el contraste del texto.
  `lint:contrast` incluye los pares de hover declarados y el informe enumera cada par.
- **R4 · Zoom al 200 %.** El contenedor de 768 px con `grid-cols-3` en experiencia puede cortar
  cargos largos a ese nivel de zoom. → Mitigación: sin anchos fijos en píxeles (solo `max-w-3xl`),
  `min-w-0` en la columna de contenido, `break-words` en el título, y verificación manual de zoom
  200 % en 1280 px de viewport (queda en 640 px CSS, una sola columna).
- **R5 · Cargos y empresas largos.** «Desarrollador fullstack mobile - SERVIMAX Y CIA S.A.S» ya
  desborda en la línea de tiempo actual. → Mitigación: rejilla con `min-w-0` en vez de flex con
  anchos intrínsecos, `break-words`, y comprobación en 320 px con el dato más largo de los tres.
- **R6 · Imagen de proyecto que no carga.** El `alt` actual se genera del objeto
  (`${image}` → `[object Object]`) y desaparece con la imagen rota. → Mitigación: RF-22 con `alt`
  descriptivo en los datos, verificado con `grep` sobre `dist/`; el caso límite de la spec queda
  cubierto porque el texto alternativo es legible por sí mismo.
- **R7 · Deriva del bloque oscuro duplicado.** D1 repite los valores oscuros en dos sitios; editar
  uno solo produce un tema incoherente que se ve a simple vista pero nadie mide. → Mitigación:
  `lint:contrast` lee `global.css` y comprueba ambos bloques contra la tabla; comentario en el
  archivo que remite a la spec.
- **R8 · Script inline sin verificación de tipos.** `astro check` no lo mira; un `undefined` en el
  script deja el tema a medias y el build sigue verde. → Mitigación: menos de 300 bytes, sin
  dependencias del DOM más allá de `documentElement` y `querySelector`, `try/catch` en todo acceso a
  `localStorage`, y revisión línea a línea registrada en el informe.
- **R9 · RNF-2 frente al script del correo.** `SocialPilllMail` ya trae un `<script>` con `confirm()`
  y un toast de ~1.2 KB. Si se suma al presupuesto de 1.5 KB, el requisito no se cumple. →
  Mitigación: el presupuesto se declara medido sobre el script de tema más el selector (objetivo
  < 500 bytes sin comprimir entre ambos) y el script del correo se documenta como preexistente y
  propiedad de la 002, con la observación de que probablemente deba desaparecer allí. Se mide con
  `wc -c` sobre el HTML emitido, no a ojo.
- **R10 · `lint:tokens` con falsos positivos.** La regex recorre la línea entera; un texto visible,
  un comentario o un string que contenga `bg-white` hace fallar la puerta. → Mitigación: no usar
  esos literales en copy ni en comentarios; si aparece un caso legítimo, se resuelve reescribiendo
  el texto, no con el escape `tokens-ok`.

## Hallazgos colaterales (declarados, no se corrigen aquí)

- `src/components/Card.astro` es un resto de la plantilla de Astro: nadie lo importa y contiene hex
  y `--accent-gradient` en un `<style>`. No rompe `lint:tokens` (la regex solo mira atributos de
  clase). Se propone borrarlo con un `/cambio`, no en esta spec.
- `src/pages/index.astro` tenía un `<main>` dentro del `<main>` de `Layout` (HTML inválido). Se
  corrige aquí porque RF-21 necesita un único destino del skip link.
- El `nav` del `Header` apunta a `#top` y `#contacto`, que no existen, y etiqueta «Sobre mí» con
  `#experiencia` y «Proyectos» con `#sobre-mi`. Se alinean etiqueta, ancla e id (`#experiencia`,
  `#proyectos`); «Contacto» desaparece porque no hay sección de contacto y el correo ya está en el
  hero. Si Sergio quiere una sección de contacto, es spec nueva.
- `SocialPill` fuerza `target="_blank"` en todos los enlaces, incluido el de descarga de la hoja de
  vida. D9 del plan de la 002 lo daba por bueno; este plan lo condiciona a que no haya `download`,
  lo que de paso resuelve ese punto de la 002.

## Orden de implementación

1. **Capa de tokens** — `src/styles/global.css` y `tailwind.config.mjs`. Nada más puede empezar
   hasta que existan las clases semánticas; es también el primer verde posible de `lint:tokens`
   (aún en rojo hasta el paso 5). (RF-4, RF-6, RF-7, RF-10, RF-11, RF-12, RF-18, RF-19)
2. **Verificación de contraste** — `scripts/check-contrast.mjs` y `npm run lint:contrast` sobre los
   tokens del paso 1. Se adelanta a propósito: si un par no llega a AA, hay que cambiarlo antes de
   pintar componentes, no después. (RF-7)
3. **Armazón** — `Layout.astro`: import del CSS, borrado de degradados y del `<style is:global>`,
   `lang`, skip link, `main` único, `theme-color` y script de tema inline. Depende de 1. (RF-1,
   RF-2, RF-4, RF-5, RF-8, RF-11, RF-20, RF-21)
4. **Selector de tema** — `ThemeToggle.astro` y su sitio en `Header.astro`. Depende de 1 y 3
   (comparte el contrato de `localStorage` y `theme-color`). (RF-2, RF-3, RF-8, RF-9, RF-23)
5. **Contenedor y piezas sueltas** — `SectionContainer`, `Badge`, `SocialPill`,
   `SocialPilllMail`, `Footer`. Aquí `lint:tokens` debe quedar en verde por primera vez, antes de
   tocar las secciones grandes. Depende de 1. (RF-11, RF-12, RF-13, RF-19, RF-23)
6. **Experiencia** — `Experience.astro` y `ExperienceItem.astro`, sin tocar props ni datos.
   Depende de 5 por el contenedor y el foco global. (RF-11, RF-12, RF-14, RF-15, RF-18, RF-19)
7. **Proyectos** — `Projects.astro` con rejilla, `<Image>`, enlace de texto y `alt` desde datos.
   Depende de 5. (RF-11, RF-14, RF-16, RF-22)
8. **Hero y página** — `index.astro`: un solo `h1`, rol, disponibilidad, pills, avatar, ids y
   erratas. Depende de 5, 6 y 7 porque es el consumidor de todo. (RF-13, RF-14, RF-17, RF-20, RF-22)
9. **Cierre** — `npm run check`, `npm run build`, `lint:tokens`, `lint:contrast`, los `grep`,
   verificaciones negativas revertidas, revisión manual con capturas y actualización de
   `docs/memoria.md` y del informe en `docs/audits/`. Depende de todo lo anterior.

---

# Fase 2 — Cambio 2026-11-17 (CR-1 a CR-7)

Spec: `specs/003-identidad-visual/spec.md`, sección «Cambios 2026-11-17» (RF-24 a RF-44).
Estado de la fase: **pendiente de aprobación de Sergio**; T28 bloqueada por la decisión pendiente
**D-5** (su análisis técnico es D19, más abajo). Tareas: T17 a T30 de `tasks.md`.

## Enfoque

El cambio no reabre la identidad: la capa de tokens sigue mandando y las siete piezas se resuelven
con lo que ya existe. **CR-6** es de tokens y configuración (un token nuevo y su mapeo). **CR-1 y
CR-2** son de script inline y marcado dentro del `<head>` y del selector. **CR-3 y CR-7** son de
marcado y assets (dos iconos, una píldora nueva y un componente menos). **CR-4 y CR-5** son de
utilidades de Tailwind (panel con capa de papel; ajuste de `word-break`). Aparte, T29 es higiene del
repo y no toca producto. **No hay dependencias nuevas, ni archivos JavaScript nuevos, ni CSS global
nuevo más allá del token que autoriza ADR-0003.** El presupuesto de cliente baja: CR-7 elimina el
módulo del correo (≈0,9 KB sin comprimir).

Se mantienen las reglas de la fase 1: cero `dark:`, cero hex en clases, cero valores arbitrarios
(`-[…]`), `lint:tokens` como puerta y ningún cambio en `src/` sin spec aprobada.

La estrategia de verificación de la fase 1 decía «Sin MCP: Netlify y Chrome DevTools no están
operativos». Eso ya no es cierto: desde 2026-11-17 el MCP `chrome-devtools` arranca con
`--executablePath` al Brave instalado (`docs/audits/2026-11-17-ui.md`, sección «Smoke test MCP»).
Por eso la fase 2 se cierra con medidas reales de navegador (T30), no con deuda declarada.

## Archivos afectados (fase 2)

| Archivo | Cambio | RF |
|---|---|---|
| `src/styles/global.css` | `--border-strong` (`45 12% 49%` claro · `220 12% 46%` oscuro) en los tres bloques de tokens. Nada más: la base (foco, transiciones, tipografía) no se toca | RF-38, RF-40, RNF-6 |
| `tailwind.config.mjs` | Entrada `'border-strong'` en `theme.extend.colors` → clase `border-border-strong`. Si D-5.A se aprueba, además `future: { hoverOnlyWhenSupported: true }` | RF-38, RF-39, RF-35 |
| `src/layouts/Layout.astro` | Script inline del `<head>`: resuelve `preferencia guardada ?? sistema`, escribe siempre `data-theme` y `theme-color` antes del primer pintado | RF-28, RF-29, RF-5 |
| `src/components/ThemeToggle.astro` | Listener de `media` escribe `data-theme` (RF-3); iconos `Sun`/`Moon` con `hidden` desde `sync()`; `aria-label` fijo «Tema oscuro»; borde `border-border-strong`; comentario de cabecera actualizado | RF-3, RF-24 a RF-27, RF-39 |
| `src/assets/icons/Sun.astro` (nuevo) | Icono de sol monocromo, `stroke="currentColor"`, `aria-hidden="true"` | RF-24 |
| `src/assets/icons/Moon.astro` (nuevo) | Icono de luna monocromo, `stroke="currentColor"`, `aria-hidden="true"` | RF-24 |
| `src/assets/icons/Whatsapp.astro` (nuevo) | Glifo de WhatsApp en `currentColor`, sin el verde de la marca | RF-32 |
| `src/components/SocialPill.astro` | Rama `mailto:` sin `target`/`rel`; `border-border-strong`; `break-all` para el 200 % | RF-42, RF-39, RF-37 |
| `src/components/SocialPilllMail.astro` | **Se borra** (recuperable desde git, como `Card.astro`) | RF-41, RF-43, RF-44 |
| `src/pages/index.astro` | La píldora del email pasa a `SocialPill` con `mailto:`; píldora de WhatsApp tras ella; iconos de WhatsApp | RF-30, RF-31, RF-41 |
| `src/components/ExperienceItem.astro` | `actionClass` con `border-border-strong` (botones «Ver» y «Descargar»). Props y datos intactos | RF-39 |
| `src/components/Projects.astro` | `article` con `relative isolate` + capa de papel en `before:`; `div` interno como panel; enlace con `border-border-strong`; `sizes` de la imagen ajustado al padding del panel | RF-33, RF-34, RF-39 |
| `.gitignore` | Ignora evidencias binarias de auditoría; los `.md` siguen rastreados | Higiene (T29) |
| `src/test.txt` | **Se borra** (5 bytes, «hello», sin uso) | Higiene (T29) |
| `docs/audits/2026-11-17-ui-cr.md` (nuevo) | Medidas de CR-1 a CR-7 y presupuesto de JS | Criterios de finalización |
| `docs/memoria.md` | Foco, decisiones y deuda al cerrar la fase | Flujo SDD |

Consumidores verificados: `SocialPill` solo lo usa `index.astro` (5 usos tras T24);
`SocialPilllMail` solo `index.astro` (1 uso, que T22 elimina); `ThemeToggle` solo `Header.astro`;
`Sun`/`Moon` solo `ThemeToggle`; `Whatsapp` solo `index.astro`.

## Decisiones técnicas (fase 2)

### D13 — `--border-strong` se expone como `border-border-strong` y su alcance es una lista cerrada

- **Clave exacta en Tailwind:** `theme.extend.colors['border-strong'] =
  'hsl(var(--border-strong) / <alpha-value>)'`, justo debajo de `border`. La clase resultante es
  **`border-border-strong`**: el prefijo de utilidad es `border-`, y el resto (`border-strong`) se
  busca como clave literal en `theme.colors`, exactamente igual que hoy funciona `border-border`
  con la clave `border`. No se toca `divideColor` ni `ringColor`: `divide-border` y `ring-ring`
  siguen apuntando a lo que apuntaban.
- **Alcance cerrado (la trampa de CR-6):** el token se usa **solo** en los cuatro componentes que
  dibujan un control interactivo, y en cada uno sustituye a `border-border`:
  1. `ThemeToggle.astro` — selector de tema.
  2. `SocialPill.astro` — las 5 píldoras (HV, Linkedin, GitHub, email, WhatsApp).
  3. `ExperienceItem.astro` — «Ver …» y «Descargar …» (8 botones), en `actionClass`.
  4. `Projects.astro` — «Ver proyecto de …» (2 botones).
  Todo lo demás **no** cambia: `Footer.astro` (`border-t border-border`), `Experience.astro`
  (`divide-y divide-border`), los tags de `Projects` (`border border-border`), el `Badge`
  (`border-primary`) y el skip link (`focus:border-border`).
  La puerta es un `grep` con resultado exacto: `grep -rln "border-border-strong" src/` debe
  devolver **cuatro rutas y ninguna más**. Si aparece una quinta, alguien oscureció un separador.
- **Por qué no se oscurece `--border`:** (1) RF-39 lo prohíbe explícitamente; (2) los separadores
  (`hr`, división entre entradas de experiencia, borde superior del pie) son decorativos y a 3:1
  pesarían visualmente sobre el papel; (3) B-1 es *advisory* de 1.4.11 —el control ya es
  identificable por su texto y su anillo de foco—, así que el problema real es de percepción en
  visión baja y se resuelve donde importa (el contorno del control), no en todo el sitio.
- **Por qué no se usa `ring` para el contorno del control:** `ring` es el foco (RF-19, D8). Un
  anillo de 3:1 permanente competiría con el `:focus-visible` y haría indistinguible «enfocado» de
  «no enfocado», que es justo lo que RF-19 protege.
- Alternativa descartada: token por componente (`--border-control`, `--border-button`). Multiplica
  la tabla de tokens y obliga a medir cada uno; la spec nombra un único token y su alcance es una
  lista de controles, no de formas.

### D14 — Secuencia exacta del script del `<head>` y por qué el listener de `media` cambia

Hoy `Layout.astro:23-31` solo escribe `data-theme` cuando hay preferencia guardada; sin ella, el
tema lo decide la media query y `theme-color` se queda en `#FBFAF9`. Con el sistema en oscuro y
sin preferencia eso es el fallo de CR-2 (`#FBFAF9` en la barra del navegador). La corrección no
añade peticiones ni CSS: cambia el orden de tres sentencias.

**Secuencia (bloqueante, dentro del `<head>`, después del `<meta name="theme-color">`):**

```js
var t = null;
try { t = localStorage.getItem('theme'); } catch (e) {}
var dark = matchMedia('(prefers-color-scheme: dark)').matches;
var theme = t === 'light' || t === 'dark' ? t : dark ? 'dark' : 'light';
document.documentElement.dataset.theme = theme;
var m = document.querySelector('meta[name=theme-color]');
if (m) m.content = theme === 'dark' ? '#0D0F12' : '#FBFAF9';
```

1. `localStorage` va en su **propio** `try/catch`: si está bloqueado, el script sigue y resuelve el
   tema del sistema (caso límite de la spec). El `try` exterior de la fase 1 envolvía todo y en ese
   escenario dejaba el `<meta>` sin corregir.
2. `prefers-color-scheme` se lee con `matchMedia` en el `<head>`, antes de que exista `<body>`.
3. `theme = preferencia válida ?? sistema`; un valor inválido (`"blue"`) se ignora.
4. `data-theme` se escribe **siempre**, también sin preferencia. Es lo que hace que `sync()` lea un
   valor real (nota de D-1 de la spec) y que el icono de RF-25 no mienta en el primer frame.
5. `theme-color` se escribe en la misma pasada, con el tema ya resuelto (RF-28 y RF-29).
6. El `<meta>` sigue en el marcado con `#FBFAF9` como valor de arranque: si el script no llega a
   ejecutarse, el HTML no queda sin `theme-color`.
7. El bloque queda por debajo de 450 bytes (el snippet de arriba mide ~360 sin la indentación del
   `<head>`), sin `src`, sin `type="module"` y sin `defer`. Sigue sin
   validación de tipos (`astro check` no mira dentro de `is:inline`), así que se revisa a mano.

**RF-3 con `data-theme` siempre presente.** El listener de `media` de `ThemeToggle.astro:55-57` hoy
solo llama a `sync()`; como `current()` lee `dataset.theme` primero, con el atributo ya escrito el
tema dejaría de seguir al sistema. Pasa a escribir el atributo:

```js
media.addEventListener('change', () => {
  if (read()) return;                                  // hay preferencia: manda ella
  document.documentElement.dataset.theme = media.matches ? 'dark' : 'light';
  sync();
});
```

- `read()` sigue devolviendo `null` cuando no hay preferencia, así que una preferencia explícita
  nunca se pisa.
- La rama de `storage` (`ThemeToggle.astro:58-64`) **no cambia**: al borrar la preferencia en otra
  pestaña elimina el atributo y `current()` cae al respaldo `media.matches`. Es el único estado en
  que `data-theme` puede faltar, y el tema resuelto sigue siendo correcto porque la media query de
  `global.css` vuelve a mandar.
- Consecuencia visual: `color-scheme` (RF-4) pasa a resolverse por `:root` / `[data-theme="dark"]`
  en lugar de por la media query. Los valores son los mismos, así que no hay cambio de píxeles.
- Alternativa descartada: resolver `theme-color` con CSS. `content` de un `<meta>` no es
  estilable; la única vía es JavaScript antes del pintado. También se descartó un `<script src>`
  con caché: llega después del primer frame (D2).

### D15 — Iconos en assets y `hidden` con `toggleAttribute`

- `Sun.astro` y `Moon.astro` viven en `src/assets/icons/`, como el resto de la iconografía, y
  siguen el patrón de `Linkedin.astro`: `<svg {...Astro.props} viewBox=… >` para que el consumidor
  solo pase `class`. Declaran `stroke="currentColor"`, `fill="none"` y `aria-hidden="true"` en el
  propio archivo (RF-24), no en el consumidor.
- **El detalle que rompe RF-27 si se ignora:** `hidden` es una propiedad IDL de `HTMLElement`;
  `SVGElement` **no** la tiene. `svg.hidden = true` crea una propiedad expando y no escribe el
  atributo. Se usa `toggleAttribute('hidden', oculto)`, que sí es de `Element` y deja el atributo en
  el DOM, que es literalmente lo que pide RF-27 y lo que comprueba el criterio de aceptación.
- **Y el segundo detalle:** el preflight de Tailwind emite `svg { display: block }` y, más abajo,
  `[hidden] { display: none }` (`node_modules/tailwindcss/lib/css/preflight.css:361-386`). El
  selector de atributo (0,1,0) gana al de tipo (0,0,1), así que `hidden` oculta de verdad. Se
  rompe en el momento en que alguien añada una utilidad de `display` (`block`, `inline-flex`) al
  icono: la capa de utilidades va después de la base. Regla: `Sun`/`Moon` solo reciben `size-5`.
- Estado inicial renderizado en servidor: luna visible, sol con `hidden`. `sync()` corrige en la
  primera ejecución, antes de que el visitante pueda pulsar.
- Caja del selector: `p-2.5` (10 px) + `size-5` (20 px) + los 2 px de borde = **44 × 44 px** con
  `box-sizing: border-box` (preflight), y `min-h-11 min-w-11` como suelo. `p-3` daría 46 × 46: el
  mínimo de RF-23 se cumpliría igual, pero la auditoría mide en múltiplos de 44 y no hay razón para
  desviarse. El ancho baja de 104 px a 44 px.
- Alternativa descartada: alternar los iconos por CSS (`[data-theme="dark"] .sol { display: block }`).
  Es cero JavaScript, pero RF-27 cierra el mecanismo a `sync()` y añadiría CSS global fuera de
  ADR-0003. También se descartó envolver cada icono en un `<span hidden>`: dos nodos extra para
  esquivar una limitación que `toggleAttribute` resuelve sola.

### D16 — `SocialPill` con rama `mailto:` (RF-42)

```ts
const { download, href, ...linkProps } = Astro.props;
const hasDownload = download !== undefined && download !== false;
const isMailto = typeof href === 'string' && href.startsWith('mailto:');
```

- `href` se desestructura para poder inspeccionarlo y se vuelve a emitir explícito (`href={href}`)
  antes del spread; si se dejara dentro de `linkProps`, el orden de los atributos del `<a>` sería el
  mismo pero la condición no podría evaluarse.
- Regla de emisión: `hasDownload ? { download } : isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' }`.
  `typeof href === 'string'` es obligatorio: el enlace de la HV pasa un `ImageMetadata`/URL de
  asset, no una cadena.
- Consecuencia: la HV conserva `download` y sigue sin `target`; LinkedIn, GitHub y WhatsApp
  conservan `target="_blank"` y `rel="noopener noreferrer"`; el email no emite ninguno de los dos y
  el clic va directo al cliente de correo (RF-43).
- Alternativa descartada: un `target`/`rel` calculado en el consumidor (`index.astro`). Reparte la
  regla en cinco llamadas y la deja a merced de que alguien copie el `<a>` a mano; RF-42 la quiere
  en el componente.

### D17 — M-1 se cierra con `break-all`, no con recortes

- Causa medida: la píldora del email mide 539 px con raíz a 32 px porque
  `sergiobaredo2904@gmail.com` no tiene puntos de corte y el `min-width: auto` del ítem flex usa su
  `min-content` (la palabra entera). El `flex-wrap` del `nav` no ayuda: la píldora ya está sola en
  su línea y aun así no cabe.
- Solución: `break-all` (`word-break: break-all`) en la clase base de `SocialPill`. Es la única
  utilidad de Tailwind 3.4 que **reduce el `min-content`**: `break-words` (`overflow-wrap:
  break-word`) permite partir la línea pero no cambia el tamaño mínimo intrínseco, y
  `overflow-wrap: anywhere` —que sí lo cambia— no existe como utilidad con nombre en v3.4 y
  exigiría un valor arbitrario, prohibido por RF-14.
- Efecto colateral aceptado: el correo puede partirse en cualquier punto («sergiobaredo29 /
  04@gmail.com») en lugar de solo tras la `@`. Es legible, no pierde caracteres y no trunca. Se
  descarta `truncate`/`text-ellipsis` y `sr-only` porque el criterio de CR-5 los prohíbe
  expresamente, y acortar la etiqueta a «Correo» porque el criterio exige que el texto siga
  completo.
- A 100 % nada cambia: a 320 px la píldora del email mide 271 px y cabe en los 288 px útiles, así
  que no hay punto de corte que aplicar. La medida se repite en T30.

### D18 — Panel y capa de papel con utilidades, y por qué hace falta un `div` interno

Estructura por proyecto:

```astro
<article class="relative isolate before:absolute before:inset-0 before:-z-10 before:translate-x-1 before:translate-y-1 before:rounded-lg before:bg-muted">
  <div class="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
    …
  </div>
</article>
```

- **Por qué el `div` interno:** el orden de pintado de CSS pone el fondo del propio elemento
  **antes** que sus descendientes con `z-index` negativo. Si el `::before` colgara del mismo
  elemento que lleva `bg-surface`, la capa de papel se pintaría **encima** del panel y el panel
  desaparecería. Con el `::before` en el `article` (sin fondo) y el `bg-surface` en el `div`
  interno, el orden es: fondo del `article` (ninguno) → `::before` con `z-index: -10` → fondo del
  `div` → contenido. El papel asoma exactamente los 4 px del desplazamiento.
- **Por qué `isolate`:** crea el contexto de apilamiento donde vive ese `z-index: -10`. Sin él, la
  capa negativa se resuelve contra el contexto de la página y puede quedar detrás del fondo de la
  sección. `-z-10` existe en Tailwind 3.4 (`zIndex` con `supportsNegativeValues: true`).
- **Geometría:** `translate-x-1`/`translate-y-1` = `0.25rem` = **4 px** con raíz a 16 px. La capa
  no se sale del contenedor: 4 px < 16 px de padding lateral y < 32 px de `gap-8` entre tarjetas,
  así que la matriz de 5 anchos sigue en 0 de overflow.
- **`p-4` en el panel y `sizes` de la imagen:** el panel necesita aire entre el borde y el
  contenido. Eso reduce el ancho útil de la imagen de 352 a 320 px en dos columnas, así que
  `sizes` pasa a `(min-width: 1024px) 320px, calc(100vw - 80px)` (320 de viewport − 32 de padding
  de sección − 32 de padding del panel). `widths={[360, 720]}` se queda: 360 cubre 320 a 1x y 720
  cubre 640 a 2x.
- **Sin sombras y sin degradados:** no se usa ninguna utilidad `shadow-*` ni `bg-gradient-*`;
  `getComputedStyle(panel).boxShadow === "none"` se mide en T30. `motion-reduce:` no interviene en
  la capa de papel (es estática): solo afecta a la inclinación de RF-35/36, que analiza D19
  (decisión pendiente D-5).
- Alternativa descartada: `after:` sobre el propio panel con `z-index` positivo. La capa quedaría
  encima del contenido y taparía texto. También se descartó un `<style>` scoped o una clase en
  `global.css`: RF-34 y D-2 lo prohíben y rompería RNF-6/RNF-7.

### D19 — Inclinación 2–3°: conflicto detectado entre RF-35 y D-2 · **bloquea T28**

> **Numeración.** Cuando Sergio la cierre, esta será la decisión **D-5** de la spec (D-1 a D-4 ya
> están cerradas en `spec.md`); en este plan el análisis vive en D19 y las opciones se etiquetan
> **D-5.A / D-5.B / D-5.C**. «D5» a secas es la decisión de fuentes del sistema y no tiene relación.

RF-35 pide «`perspective` y `rotateX`/`rotateY`» **solo** mientras el dispositivo declare
`hover: hover`, y D-2 cierra el mecanismo a utilidades de Tailwind con cero CSS propio y cero
valores arbitrarios. Con el stack instalado no se pueden cumplir las dos cosas:

- `tailwindcss@3.4.12` **no tiene** utilidades `perspective-*`, `rotate-x-*` ni `rotate-y-*`
  (`grep -rn "perspective\|rotateX\|rotateY" node_modules/tailwindcss/lib/corePlugins.js` → 0
  coincidencias). Llegaron en Tailwind 4. Solo existe `rotate-{n}` en 2D.
- La variante `hover:` **no** está envuelta en `@media (hover: hover)` en esta configuración:
  `corePlugins.js:203-204` la emite como `&:hover` salvo que se active el flag
  `future.hoverOnlyWhenSupported` (disponible en 3.4.12, `lib/featureFlags.js:37`). Es decir, la
  afirmación de D-2 («Tailwind 3.4 ya envuelve `hover:` en `@media (hover: hover)`») no se cumple
  con el `tailwind.config.mjs` actual.
- No existe ninguna variante con nombre que aplique un `transform` por **capacidad** del
  dispositivo sin interacción. La única forma con utilidades sería una variante arbitraria
  (`[@media(hover:hover)]:rotate-2`), que es un valor arbitrario y rompe RF-14.

Opciones, para que Sergio decida:

| ID | Qué implica | Cumple | Rompe |
|---|---|---|---|
| **D-5.A** (recomendada) | `/cambio` en RF-35: rotación **2D de 2°** (`rotate-2`) al pasar el puntero, con `future: { hoverOnlyWhenSupported: true }` en `tailwind.config.mjs` y `motion-reduce:transform-none`. El ángulo medido es 2°, dentro del 2–3° pedido | RF-36, RF-14, D-2, RNF-7 (0 KB de CSS propio, 0 dependencias) | La literalidad de «`perspective` + `rotateX`/`rotateY`»: el giro es plano |
| **D-5.B** | Mantener 3D con un plugin inline en `tailwind.config.mjs` (`addUtilities`/`matchUtilities`) que registre `perspective`, `rotate-x` y `rotate-y` (~10 líneas), más el flag `hoverOnlyWhenSupported` | RF-35 literal | D-2 («cero CSS propio»), RNF-7 (0 KB de CSS propio) y el presupuesto habría que ampliarlo a ≤1 KB |
| **D-5.C** | No inclinar: solo panel y capa de papel | RF-33/34 | RF-35 y RF-36 de la spec aprobada: exigiría derogarlas por `/cambio` |

Descartadas de plano: la variante arbitraria (RF-14 y el `grep` de `-[`), una regla en
`global.css` (RNF-6 y ADR-0003) y un `<style>` en el componente (D-2).

Mientras no haya decisión, **T28 no se ejecuta** y el resto de la fase 2 no depende de ella.

### D20 — Quién borra y quién edita `.gitignore`

Dos pasos de la fase 2 no los puede hacer `implementer`, y conviene decirlo antes de empezar en
lugar de descubrirlo a mitad:

- **Borrados** (`src/components/SocialPilllMail.astro`, `src/test.txt`): `implementer` no tiene
  herramienta de borrado y su `shell` solo permite `npm run *`, `npx astro *` y
  `git status|diff|log` (evidencia: T15 con `Card.astro`). Los ejecuta el **orquestador** con
  `Remove-Item <ruta>`, que pide confirmación. Precedente idéntico al de `Card.astro`.
- **`.gitignore`:** ningún agente tiene permiso de edición sobre él hoy (`implementer` permite
  `src/**`, `public/**`, `specs/**`, `astro.config.mjs`, `tailwind.config.mjs` y `tsconfig.json`;
  el orquestador, `specs/**` y `docs/**`). Decisión: añadir `.gitignore` a la lista de
  `implementer` en `opencode.jsonc` (una línea, es configuración del arnés, no del producto) o que
  Sergio haga la edición de dos líneas a mano.

## Riesgos (fase 2)

- **R11 · `hidden` no oculta.** Si un icono recibe una utilidad de `display`, la capa de utilidades
  gana al `[hidden]` del preflight y los dos iconos se ven a la vez. → Mitigación: D15 (solo
  `size-5`), y en T30 `getComputedStyle(iconoOculto).display === "none"` y
  `getBoundingClientRect().width === 0` en los dos temas.
- **R12 · `svg.hidden = true` no escribe el atributo.** `SVGElement` no tiene la propiedad IDL.
  → Mitigación: `toggleAttribute('hidden', …)`; el criterio de aceptación comprueba el atributo en
  el DOM, no la propiedad.
- **R13 · RF-3 se rompe al escribir `data-theme` siempre.** `current()` lee el atributo primero, así
  que si el listener de `media` no lo actualiza el tema deja de seguir al sistema. → Mitigación:
  D14; el listener y el script del `<head>` van en la **misma** tarea (T18) para que no exista un
  commit intermedio con la regresión; verificación en T30 alternando la emulación sin preferencia
  guardada.
- **R14 · `theme-color` con hex duplicado.** `#FBFAF9` y `#0D0F12` viven ya en `Layout.astro` y
  `ThemeToggle.astro` porque un script no puede leer variables CSS antes de la hoja. CR-2 no añade
  una tercera copia (reutiliza la expresión existente), pero la deuda sigue. → Mitigación: se
  anota en `docs/memoria.md`; unificarlo exigiría inyectar los colores desde el frontmatter
  (una constante de Astro) y no está en esta spec.
- **R15 · El icono miente sin JavaScript.** Con JS deshabilitado `sync()` no corre y el icono se
  queda en luna aunque el sistema esté en oscuro. El caso límite de la spec («el icono muestra el
  tema real porque `data-theme` se resuelve en el `<head>`) solo es cierto **con** JS: sin él no
  hay atributo ni `sync()`. → Mitigación: se declara como límite conocido en el informe de T30; el
  selector sigue inerte y visible, que es lo que la spec acepta, y el tema del sistema se sigue
  viendo por CSS (RNF-5). Si Sergio quiere que el icono acierte sin JS, hace falta un `/cambio` que
  autorice CSS para alternarlos (hoy RF-27 lo impide).
- **R16 · `break-all` parte el correo en cualquier punto.** Es menos elegante que partir tras la
  `@`, pero es la única utilidad de v3.4 que reduce el `min-content`. → Mitigación: D17; el
  criterio de CR-5 se cumple (texto completo, sin truncar, sin `sr-only`) y la medida a 100 % no
  cambia (271 px).
- **R17 · `lint:tokens` no cubre `src/assets/icons/`.** El script recorre solo
  `src/components`, `src/pages` y `src/layouts`, así que un hex dentro de `Sun.astro`,
  `Moon.astro` o `Whatsapp.astro` pasaría la puerta. → Mitigación: `grep` explícito de `#` en los
  tres archivos dentro de T19 y T24, además de `currentColor` obligatorio.
- **R18 · El criterio de RF-11 (`grep -R "gradient" src/` sin resultados) no es alcanzable.** En
  `src/` quedan 4 coincidencias, todas `<linearGradient>` de logos de marca
  (`TailwindIcon.astro:9,16` y `Nextjx.astro:13,17`), ya declaradas como excepción justificada en
  T15 (SVG de marca, no superficie CSS). → Mitigación: la verificación de T27 se hace sobre
  `Projects.astro`, `src/pages` y `src/layouts` (0 coincidencias) y se mantiene el recuento total
  en 4, sin tocar los logos.
- **R19 · El borrado queda a medias.** Si se borra `SocialPilllMail.astro` antes de migrar
  `index.astro`, el build rompe por import huérfano; si se migra y nadie borra, RF-41 queda a
  medias. → Mitigación: el orden T22 (migrar) → T23 (borrar) y el propietario explícito en cada
  una (D20). Tras T22 el `grep` ya sale limpio porque el nombre del componente solo aparecía en
  `index.astro`; lo único que falta es el archivo.
- **R20 · Presupuesto de JS sin instrumento.** `implementer` no puede ejecutar `wc -c` ni `node -e`
  (su `shell` solo permite `npm run`, `npx astro` y tres `git`). → Mitigación: la medida del
  presupuesto se hace en T30 con el mismo método que dio los 759 B (extraer los dos bloques
  inline del HTML emitido y comprimirlos), y el implementador solo anota el número de etiquetas
  `<script>` del build.
- **R21 · `.gitignore` no destraque lo ya rastreado.** Si `docs/audits/2026-11-17/*.json` y `*.png`
  ya están en el índice, añadir el patrón no los saca. → Mitigación: `git ls-files docs/audits` en
  T29; si aparecen, el paso de `deployer` es `git rm --cached` (nunca `rm` del archivo) y se avisa
  de que el histórico conserva los blobs.

## Estrategia de verificación (fase 2)

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Tipos | `npm run check` | Props de `SocialPill` (incluido el nuevo `href` desestructurado), imports de los tres iconos, `class:list`. **No** valida el interior de los `<script is:inline>` (R8 sigue vigente) |
| Build | `npm run build` | `data-theme` y `theme-color` en el `<head>`, `mailto:` sin `target`, WhatsApp con `target`/`rel`, cero `<script type="module">`, CSS con `border-border-strong` y las utilidades `before:` |
| Determinista | `npm run lint:tokens` | Cero paleta y cero hex en clases. Complementado con `grep` de hex en `src/assets/icons/` (R17) |
| Determinista | `grep` documentados por tarea | Alcance de `border-border-strong` (4 archivos exactos), ausencia de `SocialPilllMail`, `confirm(`, `mostrarToast`, `navigator.clipboard`, `rgba(`, `truncate`, `ellipsis`, `sr-only`, `shadow`, `style=` y valores arbitrarios `-[` |
| Navegador | Chrome DevTools MCP (`ui-tester`, T30) | Matriz 5 anchos × 2 temas a 100 % y con raíz a 32 px; los 4 casos de `theme-color`; nombre accesible y `aria-checked` del selector; 44 × 44; un solo icono visible; contraste del borde ≥ 3:1; desplazamiento de 4 px y `boxShadow: none`; inclinación según D-5; clic del email con espía sobre `window.confirm` y `navigator.clipboard`; 19 paradas de tabulación; CLS 0; Lighthouse A11y ≥ 95 |
| Manual documentada | `docs/audits/2026-11-17-ui-cr.md` | Presupuesto de JS (≤ 1 KB gzip tras CR-1 y CR-7), recuento de `<script>` y capturas por caso |

Verificaciones negativas, temporales y revertidas antes del cierre: preferencia oscura guardada +
sistema claro (no regresión de RF-5), preferencia borrada en otra pestaña (rama `storage`), y
`localStorage` bloqueado (`try/catch` propio en el `<head>`).

## Orden de implementación (fase 2)

1. **Token** — `--border-strong` en `global.css` y su mapeo en Tailwind (T17). Invisible: nada lo
   usa todavía, así que ninguna otra tarea depende de su presencia para compilar, pero todas las
   de borde sí.
2. **Tema en el `<head>`** — `Layout.astro` + listener de `media` de `ThemeToggle.astro` (T18). Va
   antes que los iconos porque `sync()` tiene que leer un tema real.
3. **Iconos** — `Sun.astro` y `Moon.astro` (T19), sin consumidor; después el selector (T20).
4. **Píldoras** — rama `mailto:` de `SocialPill` (T21), migración del email (T22), borrado del
   componente viejo (T23) y WhatsApp (T24).
5. **Bordes de control** — `border-border-strong` en los cuatro componentes (T25), una vez que
   todas las píldoras existen.
6. **M-1** — `break-all` en `SocialPill` (T26).
7. **Profundidad** — panel y papel en `Projects` (T27); inclinación (T28) **bloqueada** por D-5.
8. **Higiene** — `src/test.txt` y `.gitignore` (T29).
9. **Cierre** — T30: medidas en navegador, presupuesto de JS, informe y memoria. Depende de todo lo
   anterior.
