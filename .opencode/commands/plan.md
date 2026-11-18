---
description: Genera plan.md sin escribir código
agent: planner
subagent: true
---

Lee `docs/constitution.md`, `specs/$1/spec.md` y el estado real del repo.

Genera `specs/$1/plan.md` a partir de `specs/_plantilla/plan.md`. Sin código.

Requisitos del plan:

- Archivos afectados, con el RF que cubre cada uno.
- Cada decisión técnica con su alternativa descartada y su consecuencia.
- Estrategia de verificación por nivel: tipos, determinista, navegador, manual.
- Riesgos con mitigación.
- Orden de implementación por dependencias.

Si la spec tiene dudas abiertas sin resolver, detente y muéstralas antes de planificar.
No ejecutes comandos ni edites `src/`.
