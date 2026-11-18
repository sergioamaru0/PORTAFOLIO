# Memoria del proyecto

Actualizado: 2026-11-18 · agente orquestador como primario

## Foco actual

**Spec 003 fase 2 publicada en producción.** PR #1 mergeado a `main` (`2fe9199`) el 2026-11-18 a las
20:15:59Z; Netlify desplegó en 21 s y sirve `https://sergiobaredo.netlify.app`. `Build` y `Spec` en
verde; preview `https://deploy-preview-1--sergiobaredo.netlify.app`. RF-37/M-1 cerrado. T30 sigue
**diferida** solo para RF-24 a RF-44.

## Siguiente paso

1. Confirmar en GitHub que la protección de `main` quedó activa (el PAT no tiene `administration`
   para leerla ni escribirla: devuelve 403).
2. Reprogramar T30 solo para RF-24 a RF-44; M-1 ya está resuelto.
3. Después, spec 004 (SEO técnico).

## Bloqueos

- El PAT de `.secrets/github-mcp-token` sigue sin `pull_requests:write` ni `administration:write`
  (`x-accepted-github-permissions = pull_requests=write`). El PR #1 se abrió y mergeó a mano desde
  la web, así que no hay automatización de PR mientras no se regenere el token.
- T30 diferida: `ui-tester` agotó la cuota del modelo y la evidencia parcial no es concluyente.
- Spec 004 (SEO): falta el subdominio exacto de Netlify para `site`, canonical y sitemap.
- Search Console y URL de LinkedIn: pendientes para el schema `Person`.

## Decisiones recientes

- 2026-11-12 · SDD spec-anchored con el flujo del curso de MoureDev (ADR-0001).
- 2026-11-12 · Un solo MCP de navegador: Chrome DevTools; Playwright MCP descartado.
- 2026-11-12 · `AGENTS.md` limitado a 80 líneas; el detalle vive en skills.
- 2026-11-12 · 6 subagentes con permisos mínimos y 5 skills propias.
- 2026-11-12 · `npm run lint:tokens` y `npm run audit:seo` como verificaciones deterministas.
- 2026-11-12 · Tema inicial = sistema; selector de 2 estados; PDFs con `noindex`.
- 2026-11-12 · Dominio provisional `*.netlify.app` hasta comprar uno propio.
- 2026-11-13 · Orquestador primario y subagente `implementer`; los comandos no cambian el
  agente de la sesión (ADR-0002).
- 2026-11-13 · Numeración de specs: 002 experiencia laboral, 003 identidad visual, 004 SEO
  técnico.
- 2026-11-13 · Spec 002 aprobada; datos de experiencia en `src/data/experience.ts`, PDF como
  assets importados y años del hero derivados de las fechas.
- 2026-11-13 · La 001 queda reemplazada por la 003: tema e identidad se implementan juntos.
- 2026-11-13 · Dirección visual «tinta y papel»: fondo plano, un acento verde azulado,
  tipografía del sistema y sin degradados. Capa de tokens en `global.css` (ADR-0003).
- 2026-11-16 · Spec 003 implementada en 16 tareas, una por invocación de `implementer`.
  `lint:tokens` en verde, cero `dark:` y cero hex en `src/components`, `src/layouts` y `src/pages`.
- 2026-11-16 · `Card.astro` borrado: huérfano y único portador de `--accent-gradient` (autorizado
  por Sergio; recuperable desde git).
- 2026-11-16 · El `safelist` de Tailwind se vació al existir consumidores reales de los tokens.
- 2026-11-16 · JS de la 003 medido: 759 B gzip (tema 203 + selector 556), la mitad de RNF-2.
- 2026-11-16 · Spec 002 implementada completa (T1–T7): módulo de datos, props nuevas de
  `ExperienceItem`, HV y certificados como assets, verificaciones negativas T4/T5 revertidas y
  `netlify.toml` intacto.
- 2026-11-17 · Auditoría UI real (Edge headless por CDP): matriz 5×2 sin overflow, contraste
  mínimo 5,60:1, skip link 166 × 44, CLS 0, Lighthouse 99–100. Informe en
  `docs/audits/2026-11-17-ui.md`.
- 2026-11-17 · Los secretos de MCP salen de `opencode.jsonc`: viven en `.secrets/`
  (`github-mcp-token`, `netlify-mcp-token`), ignorados por git. GitHub y Netlify usan PAT;
  OpenCode V2 no carga `.env`, por eso se usa `{file:...}`.
- 2026-11-17 · `chrome-devtools` se lanza con `--executablePath` al Brave instalado, porque la
  máquina no tiene Chrome.
- 2026-11-17 · T17–T29 de la spec 003 implementadas (tema con iconos, `theme-color`, email sin
  `confirm()`, WhatsApp, `--border-strong`, `break-all`, paneles con capa de papel e inclinación
  CSS-only según D-5, higiene del repo). Build verde.
- 2026-11-17 · T30 diferida por límite de tokens del modelo; no se marca cerrada. Deploy solo a
  preview mediante rama + PR; el merge a `main` lo decide Sergio.
- 2026-11-17 · Deploy abortado por Sergio antes de commit/push/PR: nada publicado. Quedan cambios
  staged y la rama local `feat/spec-003-fase2-ui`; los `docs/audits/**/*.json.gz` exigen decisión
  antes de commitear porque `.gitignore` solo excluye `*.json` y `*.png`.
- 2026-11-17 · T31: `SocialPill` usa `max-w-full min-w-0`; las tarjetas usan `min-w-0 max-w-full`
  y `break-words` en textos y enlace. `check` 0/0/0, `build` 1 página y `lint:tokens` OK. RF-37
  sigue pendiente de medición en T30.
- 2026-11-17 · T32: textos de los `<h2>` envueltos con `min-w-0 break-words` e iconos `shrink-0`.
  Micro-auditoría RF-37: 320/375 claro/oscuro con raíz 32 px, `scrollWidth − clientWidth = 0` en las
  4 combinaciones y 0 elementos fuera del viewport. M-1 queda cerrado.
- 2026-11-17 · Protección de `main` no aplicada: el PAT de `.secrets/github-mcp-token` devuelve
  HTTP 403 en `PUT /branches/main/protection`; falta permiso de administración.
- 2026-11-18 · Rama `feat/spec-003-fase2-ui` publicada en `b016703` (86 archivos; PDF del
  certificado incluido). El PAT también devuelve 403 al crear el PR: falta `Pull requests:
  Read and write`. Sin PR no hay deploy preview de Netlify ni checks de CI visibles.
- 2026-11-18 · Revisión de HV y descargas sin hallazgos: 5/5 PDFs válidos (`%PDF-`…`%%EOF`, sin
  cifrar) y presentes en `dist` con el mismo tamaño; 9 `href` a PDF resuelven a archivos reales
  (incluidos `%20`, `%C3%93` y `%C3%91`); 5 atributos `download` con nombre limpio; `preview`
  devuelve 200 y `application/pdf` en las 5 rutas. La HV es A4 de 1 página, creada hoy en Canva,
  con texto real («SERGIO», «PERFIL», «EXPERIENCIA»). `dist/index.html` es UTF-8 sin BOM ni U+FFFD.
- 2026-11-18 · PR #1 abierto y mergeado a mano por Sergio desde la web (el PAT no podía crearlo).
  `Build` y `Spec` en verde y Deploy Preview `deploy-preview-1` listos antes del merge. Producción
  desplegada en 21 s sobre `main@2fe9199`; verificado en vivo: 5/5 PDFs con 200, `application/pdf`
  y `X-Robots-Tag: noindex`. El flujo rama → PR → checks → merge → deploy funcionó completo.

## Deuda conocida

- **T30 pendiente**: re-auditar RF-24 a RF-44 con build actual. RF-37/M-1 ya está cerrado.
- **B-1 (baja)**: resuelto provisionalmente con `--border-strong`; pendiente de re-medición en T30.
- `<meta name="description" content="Astro description" />`.
- Sin canonical, Open Graph, sitemap, robots.txt, JSON-LD ni 404 (spec 004).
- `audit:seo:strict` falla con 15 errores, todos de la 004.
- `CartaLaboralStaffing.pdf` sigue sin rastrear en git (deuda de `deployer`).
- `src/assets/icons/Nextjx.astro:4` conserva `style="mask-type:alpha"` en un SVG de marca.
- `#FBFAF9` y `#0D0F12` duplicados en `Layout.astro` y `ThemeToggle.astro` (el script no puede leer
  variables CSS antes de aplicar la hoja).
- INP no medible en local: requiere datos de campo (CrUX). Se usa TBT como sustituto.

## No repetir

- No usar colores de paleta en componentes nuevos.
- No implementar sin spec aprobada.
- No hacer push a `main` ni force-push.
- No añadir dependencias sin ADR.
- No editar archivos con `Get-Content`/`Set-Content` de PowerShell: corrompe los acentos. Usar
  UTF-8 explícito.
