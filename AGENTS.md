# Portafolio — Sergio Bareño

## Proyecto

Portafolio personal estático. Astro 4 + Tailwind 3 + TypeScript, desplegado en Netlify.
Sin backend, sin base de datos, sin autenticación. Contenido en español.

## Comandos

- Desarrollo: `npm run dev` (http://localhost:4321)
- Verificación: `npm run check` (astro check)
- Build: `npm run build` (astro check + build → dist/)
- Preview: `npm run preview`
- Tokens: `npm run lint:tokens` (prohíbe colores de paleta)
- SEO: `npm run audit:seo` (informe) · `npm run audit:seo:strict` (falla si hay errores)

## Mapa del repo

- `src/pages/` rutas · `src/components/` componentes .astro · `src/layouts/` · `src/assets/` · `src/styles/`
- `specs/NNN-slug/` especificaciones · `docs/` constitución, memoria, ADRs · `.opencode/` agentes, comandos y skills · `scripts/` verificaciones

## Flujo SDD (obligatorio)

Tipo: **spec-anchored**. Ningún cambio en `src/` sin spec aprobada.

Constitución → spec → clarificación → plan → tareas → implementación → validación → cambio.

- Una tarea por invocación (`/implementar Tn`). Verificación primero y luego **PÁRATE**.
- Nuevo requisito: actualizar la spec antes de tocar código (`/cambio`).
- Si falta una decisión: detente y pregunta. No la inventes.

## Orquestación

Primario: `orchestrator` (habla con el humano, despacha y consolida). Escribe `specs/` y
`docs/`, nunca `src/`. Los comandos no cambian el agente de la sesión.

- Specs, clarificación y cambios: `spec-writer` · plan y tareas: `planner`.
- Implementar una tarea: `implementer` (único que escribe `src/`).
- Diff: `reviewer` · navegador y a11y: `ui-tester` · SEO: `seo-auditor` · preview: `deployer`.
- `build` queda como respaldo manual.

## Estilo y convenciones

- Componentes `.astro` con Props tipadas; PascalCase.
- Tailwind en el markup; sin CSS global nuevo sin ADR.
- Solo tokens semánticos (`bg-background`, `text-foreground`). Prohibido `bg-white`, `text-black`, `bg-gray-*` en componentes.
- Imágenes con `astro:assets` y `alt` descriptivo.
- Textos de UI en español; código, identificadores y commits en inglés.
- Commits: `feat:`, `fix:`, `docs:`, `chore:`.

## UI, accesibilidad y SEO

- WCAG 2.2 AA: contraste 4.5:1, foco visible, teclado, un solo `h1` por página.
- Tema claro/oscuro consistente, `color-scheme` correcto y sin flash al cargar.
- `prefers-reduced-motion` respetado.
- Cada página: title 30–60, description 70–155, canonical y Open Graph.
- Sin overflow horizontal en 320, 375, 768, 1024 y 1440.

## Seguridad y permisos

- Nunca escribas secretos en el repo ni en `opencode.jsonc`. Usa `{env:VAR}`.
- No hagas push a `main`; rama + PR. Nunca force-push.
- PDFs y datos personales: no añadir nuevos sin decisión explícita.
- MCP de escritura solo en el subagente `deployer`, con confirmación.

## Al terminar cualquier tarea

1. `npm run check` y `npm run build` en verde.
2. Criterios de aceptación de la tarea marcados.
3. `tasks.md` y `docs/memoria.md` actualizados.
4. Evidencia en `docs/audits/` si hubo cambio visual.
