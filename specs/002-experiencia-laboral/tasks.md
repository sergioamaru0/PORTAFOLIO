# Tareas 002 — Experiencia laboral

Una tarea por invocación. Máximo 30 minutos por tarea. Verificación primero.
Spec: `specs/002-experiencia-laboral/spec.md` · Plan: `specs/002-experiencia-laboral/plan.md`

## Convenciones de este listado

- **Puerta de entrada.** El repo llega en verde por la spec 003. Antes de T1, el implementer ejecuta
  `npm run check`, `npm run build` y `npm run lint:tokens`; si alguno falla, **se detiene y lo
  reporta**: no arregla la 003 dentro de la 002. Ninguna tarea de este listado puede dejar esas tres
  puertas en rojo, ni siquiera a mitad de camino.
- **Sin MCP.** Netlify y Chrome DevTools no están operativos. La verificación es `npm run check`,
  `npm run build`, `npm run lint:tokens`, listados sobre `dist/`, `grep` y revisión manual
  documentada. Lighthouse, la matriz automática de viewports y la comprobación de cabeceras en la
  preview **no** son hechos de este listado: se declaran como deuda con responsable en T7.
- **Sin `package.json` ni scripts nuevos** (D11 del plan). Los comandos van escritos en la tarea y en
  el informe para que sean repetibles a mano.
- **Sin `git add`, `commit` ni `push`.** El rastreo de `CartaLaboralStaffing.pdf` (RF-4) lo hace
  `deployer` al commitear. El implementer solo demuestra que el import y el build local funcionan;
  mientras ese commit no exista, el build de Netlify no tiene el archivo y la preview no puede
  validarlo. `git status --short src/` mostrará esa línea `??` como deuda conocida hasta entonces.
- **Solo tokens** (D10). Nada de clases de paleta, hexadecimales, `dark:` ni `tokens-ok`. La
  presentación que dejó la 003 se conserva: rejilla `md:grid-cols-3`, `<time>` en
  `font-mono text-muted-foreground`, `min-h-11`, contenedor `max-w-3xl`.
- **Fuera de alcance de todas las tareas:** copy de los `summary` (se copia literal), textos del hero
  distintos de la cifra, SEO más allá de lo que ya hizo la 003, y cualquier PDF no autorizado.

---

- [x] **T1 — Módulo de datos `src/data/experience.ts` y cifra del hero desde el helper**
  - Archivos: `src/data/experience.ts` (nuevo), `src/pages/index.astro` (solo el `<span>` de la cifra)
  - RF: RF-1, RF-3, RF-4, RF-8, RF-10
  - Hecho cuando: el módulo exporta `IsoMonth`, `Certificate`, `ExperienceEntry`, `EXPERIENCE` y
    `experienceYearsLabel()`; `EXPERIENCE` tiene exactamente 4 entradas ordenadas de la más reciente
    a la más antigua (Staffing 2026-04→2026-07, Serdan 2025-02→2025-08, Servimax 2024-02→2024-08,
    ALG 2023-04→2023-11) con `role`, `company`, `start`, `end`, `summary` y `certificate`; importa
    los 4 PDF de `src/assets/certificatework/` —incluido `CartaLaboralStaffing.pdf`— y cada
    `certificate` trae `url`, `filename` legible y `label`; el helper suma meses trabajados (26) y
    devuelve `+ de 2 años` sin usar `Intl`; los `summary` de Serdan, Servimax y ALG se copian
    literalmente de `Experience.astro` y el de Staffing sale de la decisión cerrada de la spec; el
    módulo no contiene markup ni clases; `index.astro` interpola `{experienceYearsLabel()}` en lugar
    del literal y es su único consumidor.
  - Verificación: `npm run check && npm run build && npm run lint:tokens`;
    `grep -o "+ de 2 años" dist/index.html | wc -l` = 1; `grep -c "1 año de experiencia"
    dist/index.html` = 0; `grep -o "certificate:" src/data/experience.ts | wc -l` = 4

- [x] **T2 — `ExperienceItem` con props nuevas y `Experience` leyendo del módulo (misma invocación)**
  - Archivos: `src/components/ExperienceItem.astro`, `src/components/Experience.astro`
  - RF: RF-1, RF-2, RF-3, RF-7, RF-10, RNF-2, RNF-3
  - Hecho cuando: `interface Props` declara `role`, `company`, `start`, `end`, `summary` y
    `certificate?` (desaparecen `title`, `date`, `link` y `dowload`); el periodo son dos
    `<time datetime="YYYY-MM">` con etiqueta en español derivada del mapa de meses, dentro de la
    columna monoespaciada que dejó la 003; cargo y empresa están en elementos separados e
    identificables; las acciones viven dentro de `{certificate && (…)}` — «Ver …» con
    `target="_blank"` y `rel="noopener noreferrer"`, «Descargar …» con `download={certificate.filename}`
    —, comparten una única constante `actionClass`, llevan `min-h-11`, envuelven en
    `flex flex-wrap gap-2` y el icono de flecha queda `aria-hidden`; el texto de cada acción es una
    sola expresión que nombra la acción y la empresa (el sustantivo sale de `certificate.label`); se
    eliminan «Saber más» y la prop `dowload`; `Experience.astro` pierde el array y los imports,
    importa `EXPERIENCE` e itera `<ExperienceItem {...entry} />` dentro del `<ol>` con
    `divide-y divide-border`; cero clases de paleta, cero `dark:`, cero hexadecimales.
  - Verificación: `npm run check && npm run build && npm run lint:tokens`;
    `grep -o "<time datetime" dist/index.html | wc -l` = 8;
    `grep -o "Descargar certificado" dist/index.html | wc -l` = 4;
    `grep -o "Ver certificado[^<]*" dist/index.html` (4 líneas, cada una con su empresa);
    `grep -rn "Saber más\|dowload" src/components/` vacío;
    `grep -rn "ExperienceItem" src/` solo en `src/components/Experience.astro`

- [x] **T3 — Hoja de vida servida desde `astro:assets` en el hero**
  - Archivos: `src/pages/index.astro`
  - RF: RF-4, RF-5, RF-6, RNF-6
  - Hecho cuando: `index.astro` importa `../assets/hv/Hoja_de_Vida_sergio_bareno.pdf` y la píldora
    de la HV usa `href={hv}` con `download="Hoja de vida - Sergio Bareño.pdf"` (sin tocar
    `SocialPill`, que ya quedó con `rel` correcto y `target` condicional en la 003); no queda ninguna
    cadena `/src/` en `dist/`; el PDF aparece en `dist/_astro/` junto a los 4 certificados; el texto
    visible de la píldora no cambia salvo el nombre de descarga.
  - Verificación: `npm run check && npm run build && npm run lint:tokens`;
    `grep -rn "/src/" dist/` vacío; `(Get-ChildItem dist/_astro -Filter *.pdf).Count` = 5;
    `grep -o 'download="[^"]*"' dist/index.html` incluye `Hoja de vida - Sergio Bareño.pdf`

- [x] **T4 — Verificación negativa de RF-7: vínculo sin certificado, revertida**
  - Archivos: `src/data/experience.ts` (cambio temporal, revertido en la misma invocación)
  - RF: RF-7
  - Hecho cuando: se quita `certificate` de la entrada de Serdan y, tras compilar, el HTML no
    contiene ni «Ver certificado…Serdan» ni «Descargar certificado…Serdan» mientras las otras tres
    entradas conservan sus dos acciones (6 acciones en total); el cambio se revierte y el archivo
    vuelve exactamente al estado de T2, con el build de nuevo en 8 acciones.
  - Verificación: `npm run build` y `grep -o "certificado[^<]*Serdan" dist/index.html | wc -l` = 0,
    `grep -o "Descargar certificado" dist/index.html | wc -l` = 3; tras revertir,
    `git diff --stat src/data/experience.ts` vacío y `npm run build` con 4

- [x] **T5 — Verificación negativa de RF-10: vínculo de prueba, revertida**
  - Archivos: `src/data/experience.ts` (cambio temporal, revertido en la misma invocación)
  - RF: RF-10
  - Hecho cuando: se añade una quinta entrada que reutiliza el import de un PDF ya autorizado (sin
    crear archivos nuevos) y el diff toca **solo** `src/data/experience.ts` —datos del vínculo e
    import, cero líneas en `Experience.astro` o `ExperienceItem.astro`—; el build muestra 5 entradas
    y 10 acciones de documento; se revierte y el build vuelve a 4 entradas y 8 acciones.
  - Verificación: `git diff --stat` (solo `src/data/experience.ts`) y `git status --short src/` (solo
    la línea `??` preexistente del PDF de Staffing); `npm run build` y
    `grep -o "Descargar certificado" dist/index.html | wc -l` = 5; tras revertir,
    `git diff --stat` vacío y el mismo `grep` = 4

- [x] **T6 — RF-9 sin MCP: rutas emitidas y patrón de cabeceras (validación, no edición)**
  - Archivos: ninguno de `src/`. Lectura de `netlify.toml` y de `dist/`; la salida va al informe
  - RF: RF-9, RF-4
  - Hecho cuando: los 5 PDF del build viven bajo `dist/_astro/` y ninguno queda fuera de esa carpeta;
    `netlify.toml` conserva **sin cambios** la regla `for = "/_astro/*.pdf"` con
    `X-Robots-Tag = "noindex, nofollow"`; queda anotado en el informe que la comprobación real de
    cabeceras (`curl -I` sobre la preview) no se puede hacer aquí —`npm run preview` no aplica
    `netlify.toml` y no hay MCP— y que la ejecuta `deployer` cuando exista el commit con el PDF de
    Staffing.
  - Verificación: `glob`/`read` confirman 5 PDF en `dist/_astro/` y 0 fuera de ella;
    `netlify.toml` mantiene la regla intacta

- [x] **T7 — Informe de validación con la tabla de la spec y cierre de memoria**
  - Archivos: `docs/audits/2026-11-13-ui.md` (nuevo), `docs/memoria.md`
  - RF: todos (validación), RNF-1, RNF-4, RNF-5
  - Hecho cuando: el informe reproduce la tabla `Validación` de la spec con los 10 RF, cada uno con
    su resultado y su evidencia real (comando, salida o cita de `dist/index.html`); recoge las dos
    verificaciones negativas de T4 y T5 con su evidencia y su reversión; declara como deuda con
    responsable lo que no se puede medir sin MCP —apertura real en pestaña nueva, descarga
    completada, cabeceras en la preview, contraste medido, matriz de 320/375/768/1024/1440,
    Lighthouse— y nombra al responsable (`deployer` para preview y cabeceras, `ui-tester` para
    navegador y matriz); confirma 0 clases de paleta, 0 `dark:` y 0 `tokens-ok` en
    `src/components`, `src/layouts` y `src/pages`; deja constancia de que el preview depende del
    commit del PDF de Staffing; `docs/memoria.md` actualiza foco, decisiones y deuda (incluida la
    desaparición del 404 de la HV y del literal «+1 año»).
  - Verificación: `npm run check && npm run build && npm run lint:tokens` en verde;
    `grep -rn "dark:" src/components src/layouts src/pages` y
    `grep -rn "tokens-ok" src/` vacíos; revisión del informe: 10 filas de RF sin huecos, ninguna
    deuda declarada sin responsable

## Registro

| Fecha | Tarea | Resultado | Evidencia |
|---|---|---|---|
| 2026-11-16 | T1 | Hecho. `src/data/experience.ts` con 4 entradas, 4 imports de PDF (incluido `CartaLaboralStaffing.pdf`), helper `experienceYearsLabel()` que devuelve `+ de 2 años` (26 meses), hero interpola la función | `npm run check` 0 errores, `build` en verde, `lint:tokens` OK; `certificate:` = 4; `CartaLaboralStaffing.pdf` sigue `??` en git (deuda de `deployer`) |
| 2026-11-16 | T2 | Hecho. `ExperienceItem.astro` a props `role/company/start/end/summary/certificate`, dos `<time datetime>` por entrada (8 en total), acciones "Ver certificado" y "Descargar certificado" con `min-h-11`. `Experience.astro` lee `EXPERIENCE` del módulo. Cero `dowload`/`Saber más` | `time datetime` = 8, "Descargar certificado" = 4, "Ver certificado" = 4, `lint:tokens` OK |
| 2026-11-16 | T3 | Hecho. `index.astro` importa `../assets/hv/Hoja_de_Vida_sergio_bareno.pdf` como asset; la píldora de la HV usa `href={hv}` y `download="Hoja de vida - Sergio Bareño.pdf"`; ninguna referencia `/src/` en `dist/`; 5 PDFs en `dist/_astro/` | `npm run check` 0 errores, `build` en verde, `lint:tokens` OK; `grep /src/` en `dist/` vacío; 5 PDFs en `dist/_astro/`; `download="Hoja de vida - Sergio Bareño.pdf"` en `dist/index.html` |
| 2026-11-16 | T4 | Hecho. RF-7 verificado negativamente: se quitó `certificate` de Serdan, el build mostró la entrada sin botones (0 acciones Serdan, 3 pares restantes), se revirtió y el build final recuperó 4 entradas y 8 acciones | `npm run check` 0 errores, `build` en verde ×2, `lint:tokens` OK; con Serdan sin certificado: 0 "Ver certificado de SERDAN", 0 "Descargar certificado de SERDAN", 3 "Descargar certificado" restantes; tras revertir: 4 pares de acciones en `dist/index.html`; `git diff --stat src/data/experience.ts` vacío |
| 2026-11-16 | T5 | Hecho. RF-10 verificado negativamente: se añadió una quinta entrada (`Desarrollador backend · Prueba RF-10`) reutilizando `certificadoSerdan`, el build mostró 5 entradas y 10 acciones de documento; se revirtió y el build volvió a 4 entradas y 8 acciones. El cambio temporal solo tocó `src/data/experience.ts` | `npm run check` 0 errores, `build` en verde ×2, `lint:tokens` OK; con 5 entradas: 5 "Descargar certificado" y 5 "Ver certificado" en `dist/index.html`; tras revertir: 4 de cada uno y `git diff --stat -- src/data/experience.ts` vacío |
| 2026-11-16 | T6 | Hecho. Validación sin edición: 5 PDF en `dist/_astro/`, 0 PDF fuera de esa carpeta; `netlify.toml` conserva la regla `for = "/_astro/*.pdf"` con `X-Robots-Tag = "noindex, nofollow"`. La comprobación real de cabeceras (`curl -I` sobre preview) queda como deuda de `deployer` porque `npm run preview` no aplica `netlify.toml` y no hay MCP operativo | `npm run check` 0 errores (1 hint ajeno a la spec), `npm run build` en verde; glob `dist/**/*.pdf` devuelve 5 archivos todos bajo `dist/_astro/`; `netlify.toml` líneas 21-24 intactas |
| 2026-11-16 | T7 | Hecho. Informe de validación movido a `docs/audits/2026-11-13-ui.md` con los 10 RF, verificaciones negativas T4/T5, deudas declaradas con responsable y confirmación de tokens; `docs/memoria.md` actualizada con foco, decisiones y deuda de la 002. RF-8 corregido: helper suma `4 + 7 + 7 + 8 = 26` meses y `dist/index.html` renderiza "+ de 2 años" | `npm run check` 0 errores, `npm run build` en verde, `npm run lint:tokens` OK; `grep -rn "dark:"` y `grep -rn "tokens-ok"` vacíos; 5 PDF en `dist/_astro/`; `/src/` ausente en `dist/`; `docs/audits/2026-11-13-ui.md` presente |
