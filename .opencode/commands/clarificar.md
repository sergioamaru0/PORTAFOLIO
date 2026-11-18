---
description: Revisa una spec como QA y actualiza sus dudas abiertas
agent: spec-writer
subagent: true
---

Revisa `specs/$1/spec.md` como un QA senior.

Busca **solo defectos**:

- Ambigüedades y requisitos no verificables.
- Contradicciones internas entre RF.
- Casos límite ausentes (vacíos, errores, estados inesperados).
- Conflictos con `docs/constitution.md` o `AGENTS.md`.
- Requisitos que se cuelan en "Fuera de alcance".

No resuelvas nada. No inventes requisitos. Escribe el resultado en la sección
`Dudas abiertas` con el prefijo `[NECESITA ACLARACIÓN]` y cambia el estado a `revisada`.

Devuelve un informe con severidad (`bloqueante` / `importante` / `menor`) y la línea afectada.
