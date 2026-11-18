# Spec 003 — Identidad visual

Estado: aprobada
Tipo: spec-anchored
Fecha: 2026-11-13
Aprobada: 2026-11-17 — cambio de alcance CR-1 a CR-7 (RF-24 a RF-44) aprobado por Sergio
Sustituye a: `specs/001-tema-claro-oscuro` (misma materia, ampliada con identidad y layout)

## Contexto y objetivo

El sitio no tiene identidad: el fondo es un degradado violeta (`Layout.astro:24-30`), el `body`
fija `#262525`, los colores se deciden en 31 clases de paleta repartidas por los componentes y no
hay tokens ni control de tema. El resultado se lee como una plantilla, no como el portafolio de un
desarrollador fullstack. El objetivo es una identidad sobria y actual —«tinta y papel»— construida
sobre tokens semánticos: fondo plano, un solo acento, tipografía del sistema con jerarquía fuerte,
experiencia en dos columnas y proyectos en rejilla, con tema claro y oscuro persistentes, contraste
AA y cero dependencias nuevas. Esta spec absorbe la 001.

**Revisión 2026-11-17.** La auditoría `docs/audits/2026-11-17-ui.md` midió el build y dejó dos
hallazgos abiertos (M-1 y B-1) y tres huecos de producto que Sergio cerró en seis decisiones: selector
de tema con iconos, `theme-color` correcto sin preferencia guardada, WhatsApp en el contacto,
profundidad visual en las tarjetas de proyecto, el desborde al 200 % y un token de borde para
controles. En la misma revisión se sumó **CR-7**: la píldora de email deja de tener componente propio y
script de cliente. Los requisitos nuevos van en «Cambios 2026-11-17» (RF-24 a RF-44) y no renumeran
nada; lo que deja de valer está en «Frases derogadas». Esta revisión **no está aprobada todavía**:
hasta que el humano la apruebe, `src/` no se toca.

## Usuarios / actores

- Reclutador que abre el sitio desde un móvil y decide en menos de un minuto.
- Visitante que llega con el sistema en claro o en oscuro.
- Desarrollador y agentes que añaden componentes y necesitan tokens, no colores sueltos.

## Historias de usuario

- H1: Como reclutador quiero ver nombre, rol y disponibilidad sin ruido visual para decidir rápido.
- H2: Como reclutador quiero leer la experiencia como una cronología clara, no como una línea de tiempo decorativa.
- H3: Como visitante quiero que el sitio respete mi tema y poder cambiarlo sin que parpadee.
- H4: Como desarrollador quiero tokens semánticos para no repetir `dark:` ni hex en cada componente.
- H5: Como visitante con lector de pantalla quiero foco visible, un solo `h1` y textos en español.

## Requisitos funcionales (EARS)

### Tema

- RF-1: CUANDO un visitante abre el sitio sin preferencia guardada, EL SISTEMA aplica el tema del
  sistema operativo.
- RF-2: CUANDO el visitante selecciona claro u oscuro, EL SISTEMA aplica el tema y lo persiste en
  `localStorage`.
- RF-3: MIENTRAS no exista una preferencia explícita, EL SISTEMA sigue los cambios de
  `prefers-color-scheme` sin recargar.
- RF-4: EL SISTEMA declara `color-scheme: light` en tema claro y `color-scheme: dark` en oscuro.
- RF-5: CUANDO se carga cualquier página, EL SISTEMA aplica el tema antes del primer pintado, sin
  flash de tema incorrecto.
- RF-6: SI el visitante activa `prefers-reduced-motion: reduce`, ENTONCES EL SISTEMA no anima la
  transición de tema.
- RF-7: EL SISTEMA mantiene contraste mínimo 4.5:1 en texto normal y 3:1 en interfaz, en ambos temas.
- RF-8: CUANDO el tema cambia, EL SISTEMA actualiza `<meta name="theme-color">`.
- RF-9: EL SISTEMA ofrece un selector de dos estados, operable con teclado y con el estado
  anunciado a lectores de pantalla.

### Tokens e identidad

- RF-10: EL SISTEMA declara los tokens semánticos en `src/styles/global.css` y los mapea en
  `tailwind.config.mjs`; `src/components`, `src/layouts` y `src/pages` usan solo esos tokens.
- RF-11: EL SISTEMA usa superficies planas: ningún degradado ni color hexadecimal en el markup.
- RF-12: EL SISTEMA usa un solo acento cromático para enlaces, foco y énfasis; el resto es escala
  neutra cálida en claro y grafito en oscuro.

### Composición

- RF-13: EL SISTEMA usa un contenedor de 768 px de ancho máximo con padding lateral mínimo de 16 px.
- RF-14: EL SISTEMA usa la escala de espaciado de 4 px y la escala tipográfica `sm`–`4xl`, sin
  valores arbitrarios.
- RF-15: CUANDO el ancho es de 768 px o más, EL SISTEMA muestra cada vínculo laboral en dos
  columnas —periodo a la izquierda, contenido a la derecha—; por debajo, en una sola.
- RF-16: EL SISTEMA muestra los proyectos en una columna hasta 1024 px y en dos por encima, con
  imagen de proporción fija y el enlace como texto, sin superposiciones.
- RF-17: EL SISTEMA presenta el hero con nombre, rol, disponibilidad y accesos, sin cifras que
  contradigan la cronología publicada.
- RF-18: EL SISTEMA usa la tipografía del sistema para texto y una monoespaciada del sistema para
  fechas y etiquetas; no descarga fuentes.

### Accesibilidad y contenido

- RF-19: EL SISTEMA muestra foco visible con anillo de 2 px y desplazamiento de 2 px en todo
  elemento interactivo.
- RF-20: EL SISTEMA declara `lang="es"` y todo el texto visible en español, sin erratas conocidas.
- RF-21: EL SISTEMA ofrece «saltar al contenido» como primer elemento enfocable.
- RF-22: EL SISTEMA usa `alt` descriptivo en las imágenes; ninguno se genera a partir de un objeto.
- RF-23: EL SISTEMA da a los controles interactivos un área mínima de 44 × 44 px.

### Cambios 2026-11-17 — CR-1 a CR-7

Alcance añadido por Sergio el 2026-11-17. La numeración continúa en RF-24: ningún requisito anterior
se renumera ni se reescribe. Origen de cada bloque: CR-1, CR-3, CR-4 y CR-7 son producto nuevo; CR-2,
CR-5 y CR-6 nacen de los hallazgos M-1, B-1 y del `theme-color` del informe de auditoría.

#### CR-1 · Selector de tema con iconos sol/luna

- RF-24: EL SISTEMA muestra en el selector de tema un icono SVG monocromo —`stroke="currentColor"` y
  `aria-hidden="true"`— declarado en `src/assets/icons/Sun.astro` y en `src/assets/icons/Moon.astro`,
  en lugar de la etiqueta de texto visible.
- RF-25: MIENTRAS el tema en curso sea claro, EL SISTEMA muestra el icono de luna (destino oscuro);
  MIENTRAS el tema en curso sea oscuro, EL SISTEMA muestra el icono de sol (destino claro).
- RF-26: EL SISTEMA expone el selector como `role="switch"`, con `aria-checked` sincronizado con el
  tema en curso y con el nombre accesible fijo «Tema oscuro», que no cambia con el estado.
- RF-27: CUANDO el tema en curso cambia, EL SISTEMA alterna la visibilidad de los dos iconos con el
  atributo `hidden` desde la función `sync()` del script inline que ya existe, sin CSS nuevo y sin
  JavaScript nuevo.

Criterios de aceptación:

- `role="switch"` con `aria-checked="false"` en claro y `"true"` en oscuro, incluido el caso de
  recarga con preferencia oscura guardada.
- Nombre accesible computado exactamente «Tema oscuro» en los dos estados (inspector de
  accesibilidad del navegador).
- Caja del selector medida ≥ 44 × 44 px en ambos temas; el ancho deja de ser 104 px porque ya no hay
  texto, pero el mínimo de RF-23 se mantiene.
- Exactamente un icono visible por estado y el otro con el atributo `hidden` presente en el DOM.
- Contraste del icono ≥ 4,5:1 contra el fondo del selector en ambos temas (es `text-foreground`).
- Sin archivos JavaScript nuevos: el cambio vive en `sync()` y el total sigue por debajo de 1.5 KB
  gzip (RNF-2).

#### CR-2 · `theme-color` correcto antes del primer pintado

- RF-28: CUANDO se carga cualquier página, EL SISTEMA fija `meta[name=theme-color]` al color del tema
  en curso antes del primer pintado, también cuando no hay preferencia guardada en `localStorage`.
- RF-29: SI el sistema operativo está en oscuro y no hay preferencia guardada, ENTONCES EL SISTEMA
  aplica `#0D0F12` a `meta[name=theme-color]` antes del primer pintado.

Criterios de aceptación — los cuatro casos, leídos en el primer frame en el que existe `<body>`:

| Preferencia guardada | Sistema | `data-theme` | `theme-color` esperado | Hoy |
|---|---|---|---|---|
| clara | oscuro | `light` | `#FBFAF9` | correcto |
| oscura | claro | `dark` | `#0D0F12` | correcto |
| ninguna | oscuro | `null` | `#0D0F12` | **incorrecto: `#FBFAF9`** |
| ninguna | claro | `null` | `#FBFAF9` | correcto |

- CLS 0 en los cuatro casos y ninguna petición de red nueva: la corrección vive en el script inline
  del `<head>` (`Layout.astro:23-31`), no en un módulo externo.

#### CR-3 · WhatsApp en las formas de contacto

- RF-30: EL SISTEMA incluye en el `nav` con `aria-label="Enlaces de contacto"` una píldora con texto
  visible «WhatsApp», `href="https://wa.me/573153536433"`, `target="_blank"` y
  `rel="noopener noreferrer"`, construida reutilizando `SocialPill.astro`.
- RF-31: EL SISTEMA no muestra el número de teléfono en el texto visible de ninguna página; el número
  solo aparece dentro del `href`.
- RF-32: EL SISTEMA dibuja el icono de WhatsApp en `currentColor`, monocromo, sin el verde de la
  marca.

Criterios de aceptación:

- Texto visible exacto «WhatsApp»; el `textContent` de la píldora no contiene dígitos (`/\d/` no
  casa).
- `target="_blank"` y `rel="noopener noreferrer"` presentes en el HTML del build.
- Orden de tabulación: skip link → Experiencia → Proyectos → selector de tema → HV → Linkedin →
  GitHub → email → WhatsApp → 8 acciones de certificado → 2 «Ver proyecto» (19 paradas, una más que
  las 18 medidas el 2026-11-17).
- Altura medida ≥ 44 px y ancho que no desborda el contenedor a 320 px.
- `npm run lint:tokens` en verde: ningún hexadecimal ni color de paleta en el componente nuevo.
- Restricción para la spec 004 (D-3): el número `573153536433` **no se publica** en el JSON-LD
  `Person` ni en ningún otro dato estructurado. Solo vive en el `href` de esta píldora.

#### CR-4 · Profundidad visual en las tarjetas de proyecto

- RF-33: EL SISTEMA envuelve cada proyecto de `Projects.astro` en un panel con `bg-surface`, borde de
  1 px con `border-border` y `rounded-lg`.
- RF-34: EL SISTEMA dibuja detrás de ese panel una capa de papel apilado desplazada 4 px con
  `bg-muted`, sin sombras negras.
- RF-35: MIENTRAS el dispositivo declare `hover: hover`, EL SISTEMA inclina el panel entre 2 y 3
  grados con `perspective` y `rotateX`/`rotateY`; fuera de esa media query el panel no se inclina.
- RF-36: SI el visitante activa `prefers-reduced-motion: reduce`, ENTONCES EL SISTEMA anula la
  inclinación y cualquier transición asociada.

Criterios de aceptación:

- El fondo de página sigue plano: `grep -R "gradient" src/` sin resultados y cero degradados en el
  panel (RF-11 no se revoca).
- Desplazamiento de la capa trasera: exactamente 4 px en los dos ejes, medido en el DOM.
- `getComputedStyle(panel).boxShadow === "none"` en ambos temas.
- Con `hover: hover`: ángulo medido entre 2° y 3°; con emulación táctil (`hover: none`): `transform`
  igual a `none`; con `prefers-reduced-motion: reduce`: `transform` igual a `none`.
- La capa trasera queda por detrás y no se superpone al contenido ni al enlace «Ver proyecto de …»
  (RF-16 sigue vigente).
- Mecanismo cerrado (D-2): solo utilidades de Tailwind — `relative`, `before:absolute`, `before:inset-0`,
  `before:translate-x-1`, `before:translate-y-1`, `-z-10` y `motion-reduce:`. Cero CSS global, cero
  bloque `<style>` en el componente y cero ADR.
- Presupuesto cerrado: 0 KB de JavaScript añadido, 0 KB de CSS propio (≤ 1 KB de CSS generado por las
  utilidades), 0 dependencias nuevas.

#### CR-5 · Desborde de la píldora de email con texto al 200 % (M-1)

- RF-37: CUANDO el texto se amplía al 200 % (raíz a 32 px), EL SISTEMA no produce desborde horizontal
  en ninguna píldora del `nav` «Enlaces de contacto» a 320, 375, 768, 1024 y 1440 px:
  `document.documentElement.scrollWidth` ≤ `clientWidth`.

Criterios de aceptación:

- En los 5 anchos con raíz a 32 px: `scrollWidth − clientWidth = 0`. Hoy son 571 − 320 = 251 px a
  320 px y 571 − 375 = 196 px a 375 px (`docs/audits/2026-11-17/zoom320.json`).
- La píldora del email no supera el ancho del contenedor (hoy mide 539 px con raíz a 32 px).
- El texto sigue completo y legible: no se acepta truncar con `text-overflow: ellipsis` ni ocultar la
  dirección con `sr-only` para esquivar la medida.
- A tamaño normal el ancho medido de las píldoras no cambia (271 px la del email a 320 px).

#### CR-6 · Contraste del borde de los controles (B-1)

- RF-38: EL SISTEMA declara el token `--border-strong` en los tres bloques de
  `src/styles/global.css` —claro, oscuro del sistema y oscuro explícito— y lo mapea en
  `tailwind.config.mjs`.
- RF-39: EL SISTEMA usa `--border-strong` en el borde de todo control interactivo —selector de tema,
  píldoras y botones de acción— y conserva `--border` sin cambios para separadores decorativos.
- RF-40: EL SISTEMA garantiza un contraste de `--border-strong` de al menos 3:1 contra `--background`
  en tema claro y en tema oscuro.

Criterios de aceptación (valores calculados con la fórmula de WCAG 2.2 sobre las tripletas HSL):

- Claro: `45 12% 49%` · #8C846E · **3,57:1** contra `#FBFAF9`, 3,72:1 contra `--surface` y 3,29:1
  contra `--muted`.
- Oscuro: `220 12% 46%` · #677183 · **3,90:1** contra `#0D0F12`, 3,61:1 contra `--surface` y 3,24:1
  contra `--muted`.
- `--border` no cambia: `45 12% 87%` (1,27:1) y `220 12% 20%` (1,47:1) siguen en los separadores.
- Borde del selector medido en navegador ≥ 3:1 en ambos temas; hoy es 1,27:1 en claro y 1,47:1 en
  oscuro.
- `border-strong` no se usa en separadores (`hr`) ni en las divisiones internas de las tarjetas.
- `npm run lint:tokens` en verde.

#### CR-7 · La píldora del email pierde componente y script (resuelve D-4)

- RF-41: EL SISTEMA renderiza la píldora del email con `SocialPill.astro` y
  `href="mailto:sergiobaredo2904@gmail.com"`; `src/components/SocialPilllMail.astro` deja de existir.
- RF-42: SI el `href` de una píldora empieza por `mailto:` o el enlace lleva `download`, ENTONCES EL
  SISTEMA no emite `target` ni `rel`; en cualquier otro caso emite `target="_blank"` y
  `rel="noopener noreferrer"`.
- RF-43: CUANDO el visitante activa la píldora del email, EL SISTEMA entrega el enlace al cliente de
  correo del sistema sin diálogo intermedio, sin copiar al portapapeles y sin abrir pestaña nueva.
- RF-44: EL SISTEMA no carga JavaScript de cliente para la píldora del email: el componente no
  incluye `<script>`, ni `confirm()`, ni `mostrarToast`, ni ningún color fuera de tokens.

Criterios de aceptación:

- `src/components/SocialPilllMail.astro` no existe y `grep -R "SocialPilllMail" src/` no devuelve
  resultados.
- En el HTML del build, la píldora del email es un `<a href="mailto:sergiobaredo2904@gmail.com">` sin
  `target` y sin `rel`.
- El `nav` «Enlaces de contacto» del build no contiene ningún `<script>`: cero etiquetas dentro del
  `nav` y desaparece el módulo que Astro emitía para ese componente.
- `grep -R "confirm(\|mostrarToast\|navigator.clipboard" src/` sin resultados.
- `grep -R "rgba(\|'white'\|#fff" src/components` sin resultados; `npm run lint:tokens` en verde.
- Clic real en navegador: no se abre ningún diálogo nativo (espía sobre `window.confirm` que no llega
  a invocarse), no hay escritura en `navigator.clipboard` y no se abre pestaña nueva.
- El borde de la píldora del email es `--border-strong`, con ≥ 3:1 de contraste en ambos temas
  (RF-39).
- Se mantiene el área ≥ 44 px (RF-23) y la píldora no desborda al 200 % (RF-37).
- Los enlaces de WhatsApp, LinkedIn y GitHub del mismo `nav` conservan `target="_blank"` y
  `rel="noopener noreferrer"` (RF-30); la descarga de la HV conserva `download` y sigue sin `target`.

#### Nota · Tema resuelto en el `<head>` (resuelve D-1)

El script inline de `Layout.astro` resuelve el tema en el `<head>` —preferencia guardada **o** del
sistema— y lo escribe en `data-theme` antes del primer pintado. El listener de `media` del selector
actualiza `data-theme` cuando no hay preferencia guardada. Consecuencia: `sync()` siempre lee un valor
real, el icono de RF-25 nunca miente y `theme-color` (RF-28, RF-29) se resuelve con el mismo cambio,
sin CSS nuevo y con unas dos líneas de JavaScript.

**RF-3 sigue cumpliéndose con `data-theme` presente.** Mientras no haya preferencia explícita:

1. El listener de `media` escribe en `data-theme` el tema del sistema en cada cambio, así que el
   atributo nunca queda obsoleto y el tema se sigue sin recargar.
2. El bloque `[data-theme="dark"]` y el `:root` claro se aplican de forma coherente: al pasar a oscuro
   el atributo vale `dark`; al pasar a claro vale `light`, que además excluye el bloque oscuro de la
   media query (`:root:not([data-theme="light"])`).
3. El listener de `storage` conserva la rama que borra el atributo cuando otra pestaña elimina la
   preferencia; en ese caso `current()` mantiene el respaldo `media.matches` y el tema sigue al
   sistema. Es el único estado en que `data-theme` puede faltar, y el tema resuelto sigue siendo
   correcto.

Verificación: con el sitio abierto y sin preferencia guardada, alternar la emulación de
`prefers-color-scheme` cambia fondo, icono, `aria-checked` y `theme-color` sin recargar y sin
`localStorage`.

## Frases derogadas (2026-11-17)

Estas frases dejan de ser vigentes con la revisión del 2026-11-17. Todo lo demás sigue igual.

| Ubicación | Frase derogada | Qué la sustituye |
|---|---|---|
| «Fuera de alcance» | «Fuentes web, ilustraciones, iconografía nueva o animaciones de scroll.» | RF-24 y RF-32: se autorizan tres iconos SVG monocromos (`Sun.astro`, `Moon.astro` y el de WhatsApp). Sigue fuera de alcance cualquier otra iconografía, las ilustraciones, las fuentes web y las animaciones de scroll. |
| «Paleta y tipografía (decidido)», nota de `border` | «`border` es decorativo: cualquier límite que sea la única señal de un control usa `ring` o `primary`.» | RF-39: los controles usan `--border-strong`. `ring` sigue siendo el foco y `primary` el acento. |
| «Paleta y tipografía (decidido)» | «Sin degradados, sin sombras difusas: separación por borde de 1 px y superficie plana.» | Matizada por RF-34: la separación puede ser borde de 1 px más capa de papel desplazada 4 px. Los degradados y las sombras siguen prohibidos. |
| «Validación», fila RF-9 | «Tab + `aria-pressed`» | RF-26: el selector es `role="switch"` con `aria-checked`. `aria-pressed` nunca fue el atributo correcto para este control. |
| `src/components/ThemeToggle.astro`, comentario de cabecera | «Sin iconos nuevos (la iconografía queda fuera del alcance de la spec).» | RF-24 y RF-25. No es texto de la spec, pero se cita aquí para que ningún agente lo tome como vigente: el comentario se actualiza al implementar. |
| «Casos límite» | «JavaScript deshabilitado: tema del sistema, contenido completo, selector inerte y visible.» | Sigue vigente y ya está completa: el tema se resuelve en el `<head>` y `sync()` siempre lee un `data-theme` real (nota de D-1). |
| Código: `src/components/SocialPilllMail.astro` | Componente propio de la píldora de email, con `<script>` de cliente, `confirm()`, `mostrarToast` y colores crudos (`rgba(0, 0, 0, 0.7)`, `'white'`). | RF-41, RF-43 y RF-44: el componente se elimina y la píldora pasa a `SocialPill.astro` con `mailto:`. |
| Código: comentario de `src/components/SocialPill.astro` | «`target` y `rel` solo se emiten cuando el enlace no lleva `download`». | RF-42: tampoco se emiten cuando el `href` empieza por `mailto:`. |
| «Fuera de alcance» | «Cambiar el copy más allá de las erratas y la cifra de años.» | Ampliada por RF-30: se añade el texto «WhatsApp». |

## Requisitos no funcionales

- RNF-1: Sin dependencias nuevas y sin fuentes web: cero peticiones de tipografía.
- RNF-2: JavaScript de cliente total menor de 1.5 KB comprimido (script de tema y selector).
- RNF-3: Sin layout shift al cargar ni al cambiar de tema (CLS 0).
- RNF-4: LCP menor de 2.5 s en 4G móvil con el build actual.
- RNF-5: Sin JavaScript se muestra el tema del sistema y todo el contenido es legible.
- RNF-6: El único CSS global es el de tokens y base, declarado en el ADR-0003.
- RNF-7: El efecto de profundidad de CR-4 añade 0 KB de JavaScript, como máximo 1 KB de CSS, cero
  dependencias nuevas y cero degradados.
- RNF-8: La corrección de `theme-color` de CR-2 no añade peticiones de red ni bloquea el render: vive
  en el script inline del `<head>`. Con CR-7 desaparece el módulo de cliente de la píldora de email
  (del orden de 0,9 KB sin comprimir), así que el presupuesto total de JavaScript de cliente baja a
  **≤ 1 KB gzip**: los 759 B medidos el 2026-11-16 para tema y selector más el crecimiento de CR-1 y de
  la nota de D-1. Se verifica con el mismo método que dio esa cifra. RNF-2 (< 1.5 KB) sigue siendo el
  techo duro.

## Paleta y tipografía (decidido)

Variables HSL en `src/styles/global.css`, mapeadas en `tailwind.config.mjs` con
`hsl(var(--token) / <alpha-value>)` y `darkMode: 'selector'`.

| Token | Claro | Oscuro | Contraste medido |
|---|---|---|---|
| `background` | `45 20% 98%` · #FBFAF9 | `220 15% 6%` · #0D0F12 | — |
| `foreground` | `220 15% 10%` · #16181D | `45 15% 96%` · #F6F6F3 | 17.05 / 17.74 |
| `surface` | `0 0% 100%` · #FFFFFF | `220 14% 10%` · #16181D | — |
| `muted` | `45 15% 94%` · #F2F1ED | `220 12% 14%` · #1F2228 | — |
| `muted-foreground` | `220 9% 40%` · #5D636F | `220 8% 65%` · #9FA3AD | 5.81 / 7.64 |
| `primary` | `175 70% 26%` · #147169 | `172 60% 55%` · #47D1BF | 5.64 / 10.22 |
| `primary-foreground` | `0 0% 100%` | `220 20% 8%` · #101318 | 5.86 / 9.87 |
| `border` | `45 12% 87%` · #E2E0DA | `220 12% 20%` · #2D3139 | decorativo |
| `border-strong` | `45 12% 49%` · #8C846E | `220 12% 46%` · #677183 | 3.57 / 3.90 |
| `ring` | `175 70% 26%` | `172 60% 55%` | 5.64 / 10.22 |
| `destructive` | `0 70% 40%` | `0 65% 65%` | uso puntual |

- `border` es decorativo y no cambia: separadores, `hr` y divisiones internas de tarjetas (1,27:1 en
  claro y 1,47:1 en oscuro, aceptado como decorativo).
- `border-strong` es el borde de los controles interactivos (RF-39): selector de tema, píldoras y
  botones de acción. Cumple ≥ 3:1 contra `--background` en ambos temas (RF-40). `ring` sigue siendo
  el foco y `primary` el acento.
- Tipografía: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; metadatos
  en `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.
- Títulos con `letter-spacing: -0.02em` y `line-height` 1.1; cuerpo a 1.6 y `max-w-prose`.
- Sin degradados y sin sombras: la separación es borde de 1 px sobre superficie plana, y desde CR-4
  puede ser además una capa de papel desplazada 4 px con `bg-muted` (RF-34).

## Casos límite

- `localStorage` bloqueado o lleno: el sitio sigue funcionando con el tema del sistema.
- Preferencia guardada inválida (`"blue"`): se ignora y se usa el sistema.
- JavaScript deshabilitado: tema del sistema, contenido completo, selector inerte y visible. El icono
  muestra el tema real porque `data-theme` se resuelve en el `<head>` antes del primer pintado.
- Dos pestañas con temas distintos: la última acción gana y se sincroniza.
- Zoom al 200 %: sin overflow horizontal ni texto cortado.
- Cargo o empresa muy largos: la columna de contenido envuelve sin desbordar la rejilla.
- Imagen de proyecto que no carga: el `alt` descriptivo sigue siendo legible.
- `prefers-reduced-motion: reduce`: sin transiciones de color ni de scroll.

## Fuera de alcance

- Metadatos, datos estructurados y SEO (spec 004).
- Datos de experiencia, certificados y hoja de vida (spec 002).
- Secciones o páginas nuevas, blog, modo imprimible.
- Fuentes web, ilustraciones, animaciones de scroll y cualquier iconografía nueva **salvo** los tres
  iconos SVG monocromos de CR-1 y CR-3 (RF-24, RF-32). Ver «Frases derogadas».
- Cambiar el copy más allá de las erratas, la cifra de años y el texto «WhatsApp» de RF-30.

## Criterios de finalización

- `npm run lint:tokens` en verde (hoy falla con 31 violaciones).
- `npm run check` y `npm run build` en verde.
- Matriz de 5 anchos × 2 temas sin overflow horizontal.
- Lighthouse Accessibility ≥ 95 en móvil, en claro y en oscuro.
- Contraste de cada par de tokens verificado con el valor HSL real.
- Sin flash con un tema guardado y red limitada.
- Selector de tema con nombre accesible «Tema oscuro» y `aria-checked` correcto en los dos estados,
  con un solo icono visible (RF-24 a RF-27).
- `theme-color` correcto antes del primer pintado en los cuatro casos de RF-28 y RF-29, con CLS 0.
- Píldora de WhatsApp presente, sin dígitos en el texto visible y con `rel="noopener noreferrer"`
  (RF-30 a RF-32).
- Tarjetas de proyecto con panel y capa trasera a 4 px, sin sombras ni degradados, e inclinación de
  2–3° solo bajo `hover: hover` y anulada con `reduce` (RF-33 a RF-36).
- Los 5 anchos con raíz a 32 px sin overflow horizontal: cierra M-1 (RF-37).
- Borde de los controles ≥ 3:1 en ambos temas: cierra B-1 (RF-38 a RF-40).
- Píldora del email sin componente propio ni `<script>`, con `mailto:` sin `target` y clic directo al
  cliente de correo (RF-41 a RF-44).
- Presupuesto de CR-4 verificado: 0 KB de JavaScript añadido, 0 KB de CSS propio y ≤ 1 KB de CSS
  generado (RNF-7).
- Total de JavaScript de cliente ≤ 1 KB gzip tras CR-1 y CR-7 (RNF-8).

## Validación

| Requisito | Cómo se verifica | Evidencia |
|---|---|---|
| RF-1 | Emular `prefers-color-scheme` sin preferencia guardada | captura + `data-theme` |
| RF-2 | Cambiar tema, recargar, comprobar `localStorage` | captura + valor |
| RF-3 | Cambiar la emulación del sistema con el sitio abierto | captura |
| RF-4 | `getComputedStyle(document.documentElement).colorScheme` | valor light/dark |
| RF-5 | Captura con tema oscuro guardado y caché vacía | captura sin flash |
| RF-6 | `emulate({ prefersReducedMotion: "reduce" })` | captura |
| RF-7 | Cálculo de contraste de la tabla de tokens | informe |
| RF-8 | Inspección de `meta[name=theme-color]` | valor por tema |
| RF-9 | Tab + `aria-checked` con `role="switch"` (ver RF-26) | captura + DOM |
| RF-10 | `npm run lint:tokens` | salida en verde |
| RF-11 | Búsqueda de `gradient` y `#` en componentes | salida vacía |
| RF-12 | Inspección de tokens en `global.css` | tabla de la spec |
| RF-13 | Medir el contenedor a 1440 px | captura |
| RF-14 | Revisión de clases de espaciado y tipografía | `grep` |
| RF-15 | 768 px y 375 px en la sección de experiencia | capturas |
| RF-16 | 1024 px y 1440 px en proyectos | capturas |
| RF-17 | Lectura del hero contra las fechas publicadas | captura |
| RF-18 | Revisión de `font-family` calculado | valor del DOM |
| RF-19 | Tab por todos los interactivos en ambos temas | capturas |
| RF-20 | `lang` y revisión de textos | DOM + captura |
| RF-21 | Primer Tab al cargar | captura |
| RF-22 | Inspección de `alt` en el HTML del build | `grep` |
| RF-23 | Medir área de los controles | valores del DOM |
| RF-24 | Inspección de `ThemeToggle.astro` y de `Sun.astro`/`Moon.astro` | DOM + captura |
| RF-25 | Captura del selector en claro y en oscuro | 2 capturas |
| RF-26 | Nombre accesible y `aria-checked` en ambos estados | inspector de accesibilidad |
| RF-27 | `hidden` presente en el icono oculto, en los dos estados | atributos del DOM |
| RF-28 | Recarga con cada una de las 4 combinaciones del cuadro de CR-2 | `theme-color` leído en el primer frame |
| RF-29 | Sistema oscuro sin preferencia guardada, caché vacía | valor `#0D0F12` + captura |
| RF-30 | HTML del build del nav «Enlaces de contacto» | `grep` de `href`, `target` y `rel` |
| RF-31 | `textContent` de la píldora contra `/\d/` | salida vacía |
| RF-32 | Inspección del icono y `lint:tokens` | `currentColor` + salida en verde |
| RF-33 | Inspección del panel de `Projects.astro` | clases + captura |
| RF-34 | Medir el desplazamiento de la capa trasera | 4 px en el DOM |
| RF-35 | Emular `hover: hover` y `hover: none` y medir `transform` | matriz de 2 estados |
| RF-36 | Emular `prefers-reduced-motion: reduce` | `transform: none` |
| RF-37 | Raíz a 32 px en 320, 375, 768, 1024 y 1440 | `scrollWidth` vs `clientWidth` |
| RF-38 | Inspección de los tres bloques de `global.css` | token presente 3 veces |
| RF-39 | Búsqueda de `border-strong` en componentes | solo controles interactivos |
| RF-40 | Cálculo de contraste con las tripletas HSL reales | 3,57:1 y 3,90:1 |
| RF-41 | Existencia del archivo y `grep -R "SocialPilllMail" src/` | sin resultados + HTML del build |
| RF-42 | HTML del build del `nav` de contacto | `mailto:` sin `target`/`rel`; WhatsApp con ambos |
| RF-43 | Clic real con espía sobre `window.confirm` y `navigator.clipboard` | ni diálogo ni escritura |
| RF-44 | `grep` de `<script>`, `confirm(`, `mostrarToast`, `rgba(` en `src/` | salida vacía + `lint:tokens` |

## Decisiones cerradas

- 2026-11-13 · Esta spec sustituye a la 001: el sistema de tema se implementa una sola vez, junto
  con la identidad.
- 2026-11-13 · Dirección: «tinta y papel». Fondo plano, un solo acento verde azulado, sin
  degradados ni sombras difusas.
- 2026-11-13 · Tipografía del sistema; no se descargan fuentes.
- 2026-11-13 · Experiencia en dos columnas a partir de 768 px; se elimina la línea de tiempo con
  puntos.
- 2026-11-13 · Proyectos en rejilla de dos columnas desde 1024 px; el enlace deja de ser un overlay
  sobre la imagen.
- 2026-11-13 · La spec 002 se implementa después y reutiliza estos tokens.
- 2026-11-17 · **Selector con iconos (CR-1).** El botón de texto «Tema oscuro» pasa a dos iconos SVG
  monocromos: luna en tema claro, sol en tema oscuro. Conserva `role="switch"`, `aria-checked` y el
  mínimo de 44 × 44 px; el `aria-label` es fijo («Tema oscuro») porque el estado ya lo dice
  `aria-checked`. La visibilidad se alterna con `hidden` desde `sync()`, sin CSS ni JS nuevos.
- 2026-11-17 · **`theme-color` sin preferencia guardada (CR-2).** Con el sistema en oscuro y sin
  preferencia en `localStorage`, la barra del navegador arrancaba en `#FBFAF9`. Se exige el color
  correcto antes del primer pintado en los tres casos del cambio; el cuarto (sin preferencia y sistema
  claro) ya funciona y se verifica como no regresión.
- 2026-11-17 · **WhatsApp en el contacto (CR-3).** Píldora nueva con `href="https://wa.me/573153536433"`
  y texto visible «WhatsApp»; el número no se muestra en pantalla y el icono va en `currentColor`,
  nunca en el verde de la marca. Reutiliza `SocialPill.astro`.
- 2026-11-17 · **Profundidad en las tarjetas de proyecto (CR-4).** El fondo sigue plano y sin
  degradados. La profundidad sale del panel `bg-surface` + `border-border` + `rounded-lg` y de una
  capa de papel apilado a 4 px con `bg-muted`; inclinación de 2–3° solo bajo `hover: hover` y anulada
  con `reduce`. Presupuesto: 0 KB de JS, ≤ 1 KB de CSS, cero dependencias, cero degradados.
- 2026-11-17 · **M-1 cerrado como requisito (CR-5).** Con texto al 200 % ninguna píldora del nav de
  contacto desborda en 320, 375, 768, 1024 y 1440 px. La solución concreta (envolver, acortar la
  etiqueta o ambas) la decide el plan; la spec solo fija la medida.
- 2026-11-17 · **B-1 resuelto con un token nuevo (CR-6).** `--border-strong` (`45 12% 49%` claro,
  `220 12% 46%` oscuro) para controles interactivos, con ≥ 3:1 contra `--background`. `--border` se
  queda como está para separadores: no se oscurecen todos los bordes del sitio.
- 2026-11-17 · La spec pasa a `revisada`; sin la aprobación del humano no se toca `src/`.
- 2026-11-17 · **Tema resuelto en el `<head>` (resuelve D-1).** El script inline de `Layout.astro`
  resuelve preferencia guardada o sistema y escribe `data-theme` antes del primer pintado; el listener
  de `media` actualiza `data-theme` cuando no hay preferencia. `sync()` lee siempre un valor real, el
  icono nunca miente y `theme-color` se resuelve con el mismo cambio (~2 líneas, sin CSS). RF-3 sigue
  cumpliéndose: ver la nota de D-1.
- 2026-11-17 · **Profundidad solo con utilidades de Tailwind (resuelve D-2).** La capa de papel y la
  inclinación se implementan con `relative`, `before:absolute`, `before:inset-0`,
  `before:translate-x-1`, `before:translate-y-1`, `-z-10` y `motion-reduce:`; Tailwind 3.4 ya envuelve
  `hover:` en `@media (hover: hover)`. Cero CSS global, cero `<style>` scoped, cero ADR.
- 2026-11-17 · **El teléfono no se publica en JSON-LD (resuelve D-3).** El número de WhatsApp queda
  solo en el `href` de la píldora; la spec 004 no lo incluye en `Person` ni en ningún otro dato
  estructurado. Es una restricción dirigida a la 004, no una preferencia.
- 2026-11-17 · **La píldora del email se arregla ahora (D-4 → CR-7).** `SocialPilllMail.astro` se
  elimina (recuperable desde git, como `Card.astro`) y la píldora pasa a `SocialPill.astro` con
  `mailto:`. Desaparecen el `confirm()`, el toast, los colores crudos y el `<script>`; con ellos se va
  también el hint de build que avisaba del script tratado como `is:inline`. `SocialPill.astro` gana la
  rama que no emite `target`/`rel` para `mailto:`, igual que ya hacía con `download`.

## Dudas abiertas

Ninguna. Las cuatro dudas de la revisión del 2026-11-17 quedaron resueltas por Sergio el mismo día y
están registradas en «Decisiones cerradas»: D-1 (tema resuelto en el `<head>`), D-2 (utilidades de
Tailwind), D-3 (el teléfono no se publica en JSON-LD) y D-4 (CR-7).
