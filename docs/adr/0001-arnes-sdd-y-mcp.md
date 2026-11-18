# ADR-0001 — Arnés SDD con agentes y MCP

- Fecha: 2026-11-12
- Estado: aceptada

## Contexto

El portafolio se construyó con cambios directos sobre `main`, sin especificaciones,
sin verificación automática y con deuda visible (tema inconsistente, metadatos
placeholder, PDFs personales en un repo público).

## Decisión

Adoptar Spec-Driven Development en modo **spec-anchored**, con:

- `AGENTS.md` como instrucciones persistentes (≤ 80 líneas).
- `docs/constitution.md` con 6 principios verificables.
- `specs/NNN-slug/{spec,plan,tasks}.md` y notación EARS.
- Subagentes con permisos mínimos por rol.
- Cuatro MCP: GitHub, Netlify, Astro Docs y Chrome DevTools.
- Netlify por Git integration: `main` produce y los PR generan deploy previews.

## Alternativas descartadas

- **Seguir con cambios directos**: no deja rastro de decisiones ni permite verificar.
- **Spec Kit completo**: añade ramas y ceremony que no aportan a un repo individual.
- **Playwright MCP**: se solapa con Chrome DevTools y añade otro navegador y otro
  esquema de herramientas al contexto.

## Consecuencias

- Ningún cambio en `src/` sin spec aprobada.
- Los agentes de auditoría son de solo lectura; solo el implementador escribe código.
- El despliegue a producción nunca lo decide un agente.
- Coste: mantener `docs/memoria.md` y las specs actualizadas.
