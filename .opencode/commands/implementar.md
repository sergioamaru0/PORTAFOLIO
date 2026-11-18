---
description: Implementa una sola tarea de la spec y se detiene
agent: implementer
subagent: true
---

Lee `specs/$1/tasks.md`, `specs/$1/spec.md` y `specs/$1/plan.md`.

Implementa **exclusivamente** la tarea $2.

Reglas:

1. Si el estado de la spec no es `aprobada` ni `implementada`, detente y dilo.
2. Si la tarea no existe en `tasks.md`, detente.
3. No hagas cambios fuera del alcance de la tarea, aunque parezcan mejoras.
4. Antes de escribir código, ejecuta `npm run check` para confirmar el punto de partida.
5. Verifica exactamente lo que pide la línea `Hecho cuando:`.
6. Marca la tarea como hecha y añade la fila correspondiente en `tasks.md` → `Registro`.
7. No actualices `docs/memoria.md`: lo hace el orquestador al cerrar.
8. **PÁRATE.** No empieces la siguiente tarea. No hagas commit ni push.

Devuelve: qué cambiaste, la verificación ejecutada con su salida y qué queda pendiente.
