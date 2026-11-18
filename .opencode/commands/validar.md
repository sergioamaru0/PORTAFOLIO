---
description: Valida la spec requisito por requisito con evidencia
subagent: false
---

Valida `specs/$1/spec.md` recorriendo los RF **uno por uno**, en orden.

Para cada requisito indica:

- Qué verificación lo cubre (comando, captura, revisión manual descrita).
- El resultado real obtenido, no el esperado.

Ejecuta `npm run check` y `npm run build`. Si el plan define auditoría de navegador,
delega en los subagentes `ui-tester` y `seo-auditor` y espera sus informes.

Rellena la tabla `Validación` de la spec con la evidencia real.

Veredicto final: ¿se puede marcar la spec como `implementada`? Si algún RF falla, dilo
con claridad, no marques nada y propón qué tarea lo cubre.
