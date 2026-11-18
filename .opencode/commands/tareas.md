---
description: Divide el plan en tareas de menos de 30 minutos
agent: planner
subagent: true
---

Lee `specs/$1/plan.md` y `specs/$1/spec.md`.

Genera `specs/$1/tasks.md` a partir de `specs/_plantilla/tasks.md`.

Reglas:

- Cada tarea debe caber en menos de 30 minutos.
- Orden por dependencia: nada depende de una tarea posterior.
- Cada tarea indica los RF que cubre, una línea `Hecho cuando:` verificable y el comando
  de verificación.
- Sin tareas de relleno: si no se puede verificar, no es tarea.
- La primera tarea debe dejar el repo en verde al terminar.

Devuelve el número de tareas y la que recomiendas empezar.
