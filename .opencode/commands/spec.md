---
description: Entrevista y escribe una spec en EARS
subagent: false
---

Dirige tú la entrevista: ningún subagente puede preguntarle al humano.

Lee la skill `spec-generator` y síguela al pie de la letra.

Idea: $ARGUMENTS

Reglas:

1. No escribas código ni toques `src/`.
2. Haz preguntas de una en una, máximo seis, empezando por la que más cambie el diseño.
   Espera mi respuesta antes de la siguiente.
3. Al terminar, crea `specs/NNN-slug/spec.md` a partir de `specs/_plantilla/spec.md`.
4. El estado inicial es `borrador`.
5. Los requisitos funcionales van en EARS. Nada de Gherkin.
6. Lo que no puedas decidir queda en `Dudas abiertas` con `[NECESITA ACLARACIÓN]`.

Al terminar, resume la ruta del archivo creado y las dudas abiertas que quedaron.
