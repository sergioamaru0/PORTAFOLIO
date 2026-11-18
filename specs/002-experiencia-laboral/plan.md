# Plan 002 — Experiencia laboral

Spec: `specs/002-experiencia-laboral/spec.md`
Estado: borrador (listo para aprobación de Sergio)

## Enfoque

Separar datos de presentación: un módulo tipado `src/data/experience.ts` concentra los cuatro
vínculos, los imports de PDF y el cálculo de años; `Experience.astro` solo itera y
`ExperienceItem.astro` solo pinta. Los PDF se sirven como assets importados (`/_astro/*.pdf`,
`noindex` ya configurado) y el nombre legible de descarga vive en los datos, en el atributo
`download`, sin tocar el hash del build. La cifra del hero se deriva de las mismas fechas, de modo
que no pueda volver a contradecir la cronología. Todo sin JavaScript de cliente, sin dependencias
nuevas y sobre los tokens que deja la spec 003, que se implementa antes: `lint:tokens` ya está en
verde y esta spec no puede volver a ponerlo en rojo.

## Módulos y archivos afectados

| Archivo | Cambio | RF que cubre |
|---|---|---|
| `src/data/experience.ts` (nuevo) | Tipos `ExperienceEntry`/`Certificate`, imports de los 4 PDF, array ordenado de más reciente a más antiguo y helper `experienceYearsLabel()` | RF-1, RF-3, RF-4, RF-8, RF-10 |
| `src/components/Experience.astro` | Pierde el array y los imports; importa `EXPERIENCE` del módulo de datos y lo itera con `<ExperienceItem {...entry} />` dentro del mismo `<ol>` | RF-1, RF-10 |
| `src/components/ExperienceItem.astro` | Props tipadas nuevas (`role`, `company`, `start`, `end`, `summary`, `certificate?`); `<time datetime>`; cargo y empresa en elementos separados; dos acciones condicionales (`ver` con `target="_blank" rel="noopener noreferrer"`, `descargar` con `download`); se elimina `dowload` y el texto «Saber más» | RF-1, RF-2, RF-3, RF-7, RNF-2, RNF-3, RNF-5 |
| `src/pages/index.astro` | Importa la hoja de vida con `astro:assets`; `href` pasa de `/src/assets/hv/...` al asset del build y conserva `download`; la cifra «+1 año» pasa a `{experienceYearsLabel()}` | RF-5, RF-6, RF-8 |
| `src/assets/certificatework/CartaLaboralStaffing.pdf` | Sin cambios de contenido; se importa como asset. Su rastreo en git lo hace `deployer` al commitear, no `implementer` | RF-4 |
| `src/assets/hv/Hoja_de_Vida_sergio_bareno.pdf` | Sin cambios de contenido; solo cambia cómo se referencia | RF-4, RF-5, RF-6 |
| `netlify.toml` | Sin cambios: la regla `X-Robots-Tag` para `/_astro/*.pdf` ya cubre los 5 archivos. Se valida, no se edita | RF-9 |
| `scripts/check-tokens.mjs` | Sin cambios. Se ejecuta como puerta: debe quedar en verde (0 violaciones), no como comparación | RF-10 de la spec 003 |
| `docs/audits/2026-11-13-ui.md` (nuevo) | Informe de validación con la tabla de la spec y la evidencia | Criterios de finalización |
| `docs/memoria.md` | Se actualiza foco, decisiones y deuda al cerrar la spec | Flujo SDD |

Consumidores verificados: `ExperienceItem` solo lo importa `Experience.astro`; ningún otro archivo
usa `dowload` ni referencia `/src/assets`.

## Modelo de datos

```ts
// src/data/experience.ts
import certificadoStaffing from '../assets/certificatework/CartaLaboralStaffing.pdf';
// … los otros tres imports

/** Mes ISO: "2026-04". El tipo no valida el calendario; la verdad se comprueba en el HTML. */
type IsoMonth = `${number}-${number}`;

export interface Certificate {
  /** Ruta emitida por el build: /_astro/<nombre>.<hash>.pdf */
  url: string;
  /** Nombre legible que se propone al descargar, sin hashes ni guiones bajos. */
  filename: string;
  /** Etiqueta visible de la acción: "certificado laboral". */
  label: string;
}

export interface ExperienceEntry {
  role: string;        // cargo
  company: string;     // empresa
  start: IsoMonth;     // primer mes trabajado (incluido)
  end: IsoMonth;       // último mes trabajado (incluido)
  summary: string;     // funciones
  certificate?: Certificate;
}

export const EXPERIENCE: ExperienceEntry[] = [ /* Staffing, Serdan, Servimax, ALG */ ];
export function experienceYearsLabel(): string { /* suma de meses → "+ de 2 años" */ }
```

Contenido publicado (más reciente primero):

| Orden | Cargo | Empresa | Periodo | Certificado |
|---|---|---|---|---|
| 1 | Desarrollador fullstack | Staffing | 2026-04 → 2026-07 | `CartaLaboralStaffing.pdf` |
| 2 | Desarrollador fullstack web | Serdan | 2025-02 → 2025-08 | `CertificadoLaboralSerdan.pdf` |
| 3 | Desarrollador fullstack mobile | Servimax y Cía S.A.S | 2024-02 → 2024-08 | `certificado _laboral_servimax.pdf` |
| 4 | Desarrollador fullstack web | ALG Creation S.A.S | 2023-04 → 2023-11 | `CARTA DE RECOMENDACIÓN SERGIO ANDRES BAREÑO CUBILLOS.pdf` |

Nombres de descarga: `Certificado laboral - Staffing.pdf`, `… - Serdan.pdf`, `… - Servimax.pdf`,
`… - ALG Creation.pdf`, y `Hoja de vida - Sergio Bareño.pdf`.

Meses trabajados con los datos actuales: 8 + 7 + 7 + 4 = **26 meses** → `+ de 2 años`
(coincide con la decisión cerrada; el intervalo 2023-04→2026-07 sería «+ de 3 años» y sobreestima
por los huecos entre vínculos).

## Decisiones técnicas

### D1 — Los datos viven en `src/data/experience.ts`, con cargo y empresa en campos separados

- Motivo: RF-10 exige que añadir un vínculo sea editar datos e importar su PDF; RF-1 exige cargo y
  empresa identificables por separado, cosa imposible con el `title` actual
  (`'Desarrollador fullstack web - SERDAN'`).
- Alternativa descartada: mantener el array en el frontmatter de `Experience.astro`. Funcionaría,
  pero deja los datos mezclados con markup, el hero no puede reutilizar la cronología y el archivo
  queda como componente con 60 líneas de contenido.
- Consecuencia: `Experience.astro` baja a ~15 líneas; el módulo no entra en el alcance de
  `lint:tokens` (que solo mira `components`, `pages`, `layouts`) y no contiene markup.

### D2 — Periodo como meses ISO con `<time datetime>`, etiqueta derivada por mapa de meses

- Motivo: RF-1 pide periodo identificable y el HTML actual tiene `<time>` sin `datetime`, por lo
  que la fecha no es legible por máquina. Guardar `2026-04` permite generar tanto el texto en
  español como el atributo, y alimenta el cálculo de años de D6 con una sola fuente.
- Alternativa descartada: guardar solo la cadena visible (`'abril 2026 - julio 2026'`). Es lo que
  hay hoy: no hay `datetime` válido, y la cifra del hero queda desconectada de las fechas.
  También se descartó `Intl.DateTimeFormat('es-CO')`: mete «de» según la versión de ICU del Node
  del build y hace que el texto dependa del entorno.
- Consecuencia: un mapa de 12 meses en el módulo (determinista, sin ICU). El render es
  `<p class="…"><time datetime="2026-04">abril 2026</time> — <time datetime="2026-07">julio 2026</time></p>`.
  El tipo `IsoMonth` es solo una ayuda: `astro check` no valida el calendario, así que el formato se
  comprueba en el HTML del build.

### D3 — Los PDF se exponen como assets importados desde `src/assets/`, nunca desde `public/`

- Motivo: RF-4 lo pide literalmente; el import garantiza que el archivo exista en `dist/` con la
  ruta que emite el build (hoy la HV apunta a `/src/assets/...` y da 404), y deja los PDF bajo
  `/_astro/`, que ya es donde `netlify.toml` aplica `X-Robots-Tag: noindex, nofollow` (RF-9) y
  `Cache-Control: immutable`.
- Alternativa descartada: copiar los PDF a `public/`. Daría URLs estables y sin hash, pero rompe
  RF-4, pierde el `noindex` por patrón, no cachea de forma inmutable y desliga el archivo de su
  import, así que un PDF ausente ya no rompe el build (perderíamos la única detección temprana).
- Consecuencia: las URLs llevan hash y pueden llevar espacios y acentos según el nombre original;
  de ahí D4 y el riesgo R2.

### D4 — El nombre legible va en el atributo `download`, no en la URL

- Motivo: RF-3 exige `download` con nombre legible y sin hashes ni guiones bajos; el hash del build
  es necesario para RF-4 y la caché inmutable. `download="Certificado laboral - Staffing.pdf"`
  sobre un `href` con hash es same-origin, así que el navegador respeta el valor y propone ese
  nombre.
- Alternativa descartada: `Content-Disposition` por archivo en `netlify.toml`. Exigiría una regla
  por hash (que cambia en cada build), no funciona en `npm run preview` y además forzaría la
  descarga del mismo archivo que RF-2 quiere poder *ver* en pestaña nueva.
- Consecuencia: el nombre de descarga es un dato más (`Certificate.filename`), editable sin tocar
  componentes (RF-10); el mismo PDF sirve para ver y para descargar.

### D5 — Un solo `certificate` opcional por vínculo

- Motivo: elimina por construcción el caso «certificado duplicado» y el `link`/`dowload` repetidos
  de hoy; RF-7 se cumple con `{certificate && (…)}`, sin enlaces muertos.
- Alternativa descartada: dos campos independientes (`viewUrl` + `downloadUrl`), como ahora. Es
  justo lo que produjo la prop `dowload` declarada y nunca usada, y permite estados incoherentes
  (ver sí, descargar no).
- Consecuencia: si en el futuro un vínculo necesita dos documentos, se cambia el tipo con `/cambio`,
  no se añade un campo suelto.

### D6 — La cifra del hero se calcula sumando los meses de los vínculos publicados

- Motivo: RF-8 exige coherencia permanente; con el dato duplicado en `index.astro` la cifra ya se
  desincronizó («+1 año» frente a 2023-04→2026-07). Sumar meses *trabajados* (sin contar huecos)
  da 26 meses → `+ de 2 años`, exactamente la decisión cerrada.
- Alternativa descartada: escribir «+ de 2 años» a mano en `index.astro`. Es una línea, pero
  reproduce el defecto actual: el texto no depende de los datos y vuelve a desincronizarse en el
  próximo vínculo. También se descartó calcular por intervalo total (2023-04→2026-07 = 3 años y
  3 meses → «+ de 3 años»), que contradice la decisión cerrada y sobreestima por los huecos.
- Consecuencia: `experienceYearsLabel()` en el módulo de datos; el hero solo interpola. Guarda
  documentada: si la suma es múltiplo exacto de 12, se omite el «+ de» para no afirmar de más.
  Hoy el helper devuelve `+ de 2 años`.

### D7 — Las dos acciones son enlaces nativos, sin JavaScript

- Motivo: RNF-1 prohíbe JS de cliente; `<a download>` y `<a target="_blank">` son la única forma
  nativa de ver y descargar. RNF-2 se cumple con texto que nombra acción y empresa
  («Ver certificado de Staffing», «Descargar certificado de Staffing»); el icono de flecha ya
  existente mantiene `aria-hidden`.
- Alternativa descartada: `<button>` + `fetch` + `Blob` para forzar el nombre de archivo. Da más
  control del nombre pero exige JS, duplica la descarga en memoria y deja el botón inservible sin
  JS.
- Consecuencia: en navegadores que ignoran `download` (algunos móviles) el enlace abre el PDF; el
  texto sigue siendo correcto y la descarga se completa igualmente desde el visor. Se declara como
  límite conocido en el informe (R3). No se añade icono nuevo de descarga: sería un asset más para
  un beneficio nulo.

### D8 — `ExperienceItem` queda presentacional y `Experience` solo itera

- Motivo: RF-10 y separación de responsabilidades; hoy el componente mezcla datos, ruta de PDF y
  markup, y el `title` concatenado impide cumplir RF-1.
- Alternativa descartada: mantener `title` y añadir `company` aparte. Deja el campo viejo como
  fuente de duplicación y permite que vuelva a aparecer el formato «cargo - empresa».
- Consecuencia: cambio incompatible de props, sin impacto externo (un solo consumidor verificado);
  `npm run check` falla si queda algún uso con las props antiguas.

### D9 — La hoja de vida se importa en `index.astro` y se descarga vía `SocialPill`

- Motivo: RF-5 y RF-6. El `href` actual es una ruta de `src/` que no existe en `dist/`; el
  `download` ya está puesto y se conserva (con nombre más legible). `SocialPill` propaga
  `{...Astro.props}`, así que acepta `href` y `download` sin cambios.
- Alternativa descartada: crear un componente de descarga aparte para el hero. Duplicaría el estilo
  de `SocialPill` y añadiría superficie para un solo enlace; la HV no es un vínculo laboral, por eso
  tampoco vive en `src/data/experience.ts`.
- Consecuencia: un import más en la página. `SocialPill` fuerza `target="_blank"`; el `download`
  sigue funcionando porque el archivo es same-origin (se valida en RF-6).

### D10 — La sección se escribe con los tokens de la spec 003 y `lint:tokens` sigue en verde

- Motivo: la 003 (identidad visual) se implementa **antes** que esta spec y deja
  `src/styles/global.css` con los 10 tokens, `tailwind.config.mjs` mapeándolos y
  `npm run lint:tokens` en verde (0 de 31). Su RF-10 ya obliga a que `src/components`,
  `src/layouts` y `src/pages` usen solo tokens, sin `dark:`. Conservar las clases de paleta de hoy
  mientras se cambian las props convertiría la 002 en una regresión de la 003: el markup nuevo
  quedaría fuera del sistema de tema y la puerta determinista volvería a rojo.
- Alternativa descartada: la versión anterior de esta decisión —conservar literalmente
  `bg-gray-500`, `text-yellow-900`, `bg-white` y los `dark:`—, redactada cuando la 001 seguía
  pendiente y los tokens no existían. Se descarta porque el punto de partida cambió: los tokens ya
  existen, `lint:tokens` ya está en verde y «no aumentar el conteo» deja de tener sentido cuando el
  conteo es cero. También se descarta `tokens-ok`: oculta la violación en lugar de resolverla.
- Consecuencia: regla para la implementación — (a) todo color del markup sale de tokens
  (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`,
  `text-primary`, `ring-ring`); (b) cero clases de paleta, cero hexadecimales y cero `dark:` (el
  tema lo resuelve la capa de tokens); (c) la presentación que dejó la 003 se conserva —rejilla
  `md:grid-cols-3`, `<time>` en `font-mono text-muted-foreground`, `min-h-11`— y solo cambia lo que
  pide esta spec; (d) las dos acciones comparten una constante `actionClass` para no duplicar la
  cadena de clases; (e) el criterio de aceptación es `npm run lint:tokens` **en verde**, no «no
  aumentar el conteo»; (f) los tokens siguen siendo propiedad de la 003: si falta un estado se usa
  una variante de un token existente (`hover:bg-muted`), y si de verdad hace falta un token nuevo se
  abre `/cambio` en la 003, no se improvisa aquí.

### D11 — Verificación determinista con comandos documentados, sin script nuevo

- Motivo: RF-4, RF-5 y RF-9 se comprueban sobre `dist/` y son objetivos, pero son tres
  comprobaciones de una sola vez.
- Alternativa descartada: añadir `scripts/check-experience.mjs` y un script de `package.json`.
  Sería repetible, pero suma superficie permanente y un comando más que mantener para una
  verificación que se ejecuta al cerrar la spec.
- Consecuencia: el informe guarda los comandos exactos (listado de `dist/_astro/*.pdf`, búsqueda de
  `/src/` en `dist/`, `curl -I` del PDF) para que sean repetibles a mano; si la comprobación se
  vuelve recurrente, se promueve a script con su propio cambio de spec.

## Estrategia de verificación

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Tipos | `npm run check` | Props tipadas de `ExperienceItem`, tipos del módulo de datos, imports `*.pdf` (declarados en `astro/client`), ausencia de usos con props viejas |
| Build | `npm run build` | Emisión de los 5 PDF en `dist/_astro/`, HTML final con `download`, `datetime` y `rel`, sin errores de compilación |
| Determinista | comandos documentados sobre `dist/` | RF-4: `dist/_astro/*.pdf` contiene exactamente los 5 PDF autorizados. RF-5: `grep -r "/src/" dist` sin resultados. RF-3: `download="…"` presentes con nombre legible. RF-9: `curl -I` sobre la preview devuelve `X-Robots-Tag: noindex, nofollow`. Guarda de tokens: `npm run lint:tokens` en verde (0 violaciones) |
| Navegador | **no disponible** (Chrome DevTools MCP inoperativo) → revisión manual documentada sobre `npm run preview` | RF-2: abrir el PDF en pestaña nueva y comprobar `rel` y 200. RF-6: descargar la HV y comprobar el nombre legible. RNF-3: foco visible por teclado y área ≥ 24 px. RNF-4: contraste de botones en ambos temas. RNF-5: `scrollWidth <= clientWidth` en 320, 375, 768, 1024 y 1440, medido a mano en DevTools del navegador |
| Manual | revisión con evidencia | Tabla `Validación` de la spec, RF por RF, con capturas y citas de HTML en `docs/audits/2026-11-13-ui.md` |

La matriz de navegador queda como **comprobación manual pendiente**: sin Chrome DevTools MCP no hay
automatización. Se documenta lo observado y lo no verificado en el informe, sin declarar en verde lo
que no se ha medido.

Verificaciones negativas, temporales y revertidas antes del cierre (el build final publica los
cuatro vínculos con certificado):

- RF-7: quitar `certificate` de un vínculo, build, capturar que la entrada no muestra botones y
  revertir. Se registra el HTML y el `git diff` limpio posterior.
- RF-10: añadir un vínculo de prueba con su import, capturar el diff (solo datos + import, cero
  cambios en componentes) y revertir.

Fuera de esta verificación: `audit:seo:strict` (spec 004). `lint:tokens` no es una comprobación
externa: es la puerta de esta spec y debe quedar en verde.

## Riesgos

- **R1 · `CartaLaboralStaffing.pdf` no está rastreado en git.** El import funcionaría en local y
  fallaría en el build de Netlify, que clona el repositorio. → Mitigación: el rastreo lo hace
  `deployer` en el commit (`git add` del PDF) o Sergio a mano; `implementer` solo verifica con
  `git ls-files` que el archivo aparece y que el build local emite los 5 PDF. El build de la preview
  de Netlify es la prueba final. Si el archivo no se rastrea, no se publica (caso límite de la
  spec).
- **R2 · Nombres con espacios y acentos** (`CARTA DE RECOMENDACIÓN … BAREÑO CUBILLOS.pdf`,
  `certificado _laboral_servimax.pdf` con espacio doble). Vite sanea algunos caracteres al emitir el
  asset y el resultado puede diferir entre Windows (local) y Linux (Netlify), con riesgo de 404 o de
  doble codificación en el `href`. → Mitigación: no tocar los nombres; verificar cada URL emitida
  contra `dist/` y con `curl -I` en la preview; si alguna falla, contingencia documentada: renombrar
  el archivo a slug ASCII (`carta-recomendacion-alg-creation.pdf`), actualizar solo el import y
  registrar el cambio en el informe. Renombrar además reduce la exposición del nombre completo en
  la URL (RNF-6).
- **R3 · `download` ignorado por algunos navegadores** (móviles, iOS, o cualquier caso
  cross-origin). → Mitigación: servir siempre same-origin desde `/_astro/`, nombre legible en el
  atributo y texto del botón que ya anuncia la acción; aceptar que en esos navegadores el PDF se
  abra en el visor. Se declara el límite en el informe en lugar de prometer un comportamiento que
  no controlamos.
- **R4 · Regresión de la capa de tokens de la spec 003.** El repo llega con `lint:tokens` en verde y
  la sección tokenizada; si el implementer reescribe `ExperienceItem`/`Experience` partiendo de una
  copia del markup viejo (paleta, `dark:`, hexadecimales) reintroduce las 31 violaciones y devuelve
  la puerta a rojo, además de dejar la sección fuera del tema. → Mitigación D10: el markup nuevo se
  escribe solo con tokens, sin `dark:` ni `tokens-ok`, conservando la presentación de la 003;
  `npm run lint:tokens` se ejecuta en cada tarea que toque un componente y otra vez antes de cerrar.
  Si falta un token, se resuelve con una variante de uno existente o con `/cambio` en la 003.
- **R5 · Cambio incompatible de props de `ExperienceItem`.** → Mitigación: único consumidor
  verificado (`Experience.astro`); `npm run check` rompe si aparece otro uso, y se busca
  `ExperienceItem` antes de cerrar.
- **R6 · Overflow en 320 px** con dos botones de etiqueta larga dentro de una sección de 740 px. →
  Mitigación: contenedor de acciones con `flex flex-wrap gap-2`, texto `text-sm`, sin anchos fijos,
  y comprobación manual de la matriz de anchos (sin MCP) anotada en el informe.
- **R7 · La cifra del hero deja de coincidir con la decisión cerrada** si en el futuro se añade un
  vínculo que cruce los 36 meses. → Mitigación: helper documentado y con guarda de múltiplo exacto;
  hoy produce `+ de 2 años`. Si el dato cambia de verdad, se revisa con `/cambio` en la spec, no se
  fuerza el texto.
- **R8 · Pérdida del `noindex`** si alguien mueve un PDF a `public/` en el futuro. → Mitigación:
  RF-4 lo prohíbe explícitamente, D3 lo justifica y RF-9 se verifica con `curl -I` sobre la
  preview; el patrón `/_astro/*.pdf` de `netlify.toml` no se toca.

## Hallazgos colaterales (declarados, no se corrigen aquí)

Detectados al leer los archivos afectados; quedan fuera del alcance de la spec 002 y no se tocan
para no mezclar cambios:

- `src/components/SocialPill.astro` tiene `rel="nooper nofer"` (typo) y fuerza `target="_blank"`.
  Afecta a todos los enlaces sociales; el de la HV queda con `noopener` inoperante. Es un cambio de
  una palabra, pero no lo pide ningún RF: se propone como spec aparte o `/cambio`.
- `src/components/SectionContainer.astro` declara `class=` seguido de una plantilla sin llaves, por
  lo que `w-full mx-auto lg:w-[740px]` puede no aplicarse. Si el ancho real difiere, la matriz de
  overflow lo mostrará; no se corrige en esta spec.
- Textos con erratas en `index.astro` («Experiancia laboral», «De Bogota, co Colombia») y
  `<html lang="en">` en `Layout.astro`: fuera de alcance (spec 003/004 y copy).

## Orden de implementación

1. **Módulo de datos** — `src/data/experience.ts` con tipos, 4 imports, entradas ordenadas y helper
   de años. Base de todo lo demás. (RF-1, RF-3, RF-4, RF-8, RF-10)
2. **Componente de entrada** — `ExperienceItem.astro` con props nuevas, `<time datetime>`, cargo y
   empresa separados y acciones condicionales. Depende de 1 por los tipos. (RF-1, RF-2, RF-3, RF-7)
3. **Sección** — `Experience.astro` consume el módulo y deja de contener datos. Depende de 1 y 2.
   (RF-1, RF-10)
4. **Hero** — `index.astro`: cifra desde el helper e import de la hoja de vida. Depende de 1 por el
   helper. (RF-5, RF-6, RF-8)
5. **Verificación y evidencia** — `npm run check`, `npm run build`, deterministas sobre `dist/`,
   matriz de navegador manual, verificaciones negativas revertidas y `docs/audits/2026-11-13-ui.md`.
   (todos)

El rastreo de `CartaLaboralStaffing.pdf` no es un paso de implementación: es un requisito de
integridad que `deployer` cierra en el commit. Antes de la preview se comprueba con `git ls-files`
que los 5 PDF están rastreados.
