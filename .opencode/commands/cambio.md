---
description: Actualiza la spec antes de tocar código
agent: spec-writer
subagent: true
---

Nuevo requisito: $ARGUMENTS

No toques `src/`. El código cambia después de la spec, nunca antes.

1. Identifica la spec afectada: `$1` si se indica; si no, la que esté en curso según
   `docs/memoria.md`.
2. Añade o modifica los RF en EARS. Actualiza casos límite, fuera de alcance y criterios
   de finalización.
3. Cambia el estado a `revisada` y añade la duda abierta si el requisito no está cerrado.
4. Devuelve qué RF tocaste, por qué y qué contradicciones encontraste.

Si el requisito contradice `docs/constitution.md`, dilo y detente.
