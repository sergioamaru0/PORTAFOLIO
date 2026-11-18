# Flujo SDD

Método: **spec-anchored**. La especificación vive en el repositorio, se aprueba antes de
implementar y se actualiza cuando cambia el requisito.

## Taxonomía

| Tipo | Qué significa | ¿Lo usamos? |
|---|---|---|
| spec-first | La spec se escribe antes, pero puede quedar obsoleta | No |
| **spec-anchored** | La spec se mantiene junto al código y es la referencia | **Sí** |
| spec-as-source | La spec genera el código; el código no se edita a mano | No |

## Pasos y prompts

El primario es `orchestrator`: recibe al humano, lanza el subagente de cada paso y
devuelve el resultado consolidado. Los comandos no cambian el agente de la sesión.

| Paso | Comando | Quién | Prompt esencial | Artefacto |
|---|---|---|---|---|
| 1. Constitución | `/constitucion` | orquestador (histórico) | "Propón 6 principios cortos y verificables. Espera mi aprobación." | `docs/constitution.md` |
| 2. Especificación | `/spec "idea"` | orquestador (entrevista) | "No escribas código. Hazme preguntas de una en una (máx. 6) y genera spec.md con RF en EARS." | `specs/NNN-slug/spec.md` |
| 3. Clarificación | `/clarificar NNN-slug` | `spec-writer` | "Revisa la spec como QA: ambigüedades, contradicciones y casos límite. Solo detecta." | `Dudas abiertas` |
| 4. Planificación | `/plan NNN-slug` | `planner` | "Sin código: módulos, decisiones con alternativa descartada y estrategia de verificación." | `plan.md` |
| 5. Tareas | `/tareas NNN-slug` | `planner` | "Tareas de menos de 30 min, ordenadas, con RF y 'Hecho cuando:'." | `tasks.md` |
| 6. Implementación | `/implementar Tn` | `implementer` | "Implementa solo Tn. Verifica y PÁRATE." | `src/` + `tasks.md` |
| 7. Validación | `/validar NNN-slug` | orquestador + auditores | "Recorre RF por RF: qué verificación lo cubre y su resultado." | informe + evidencia |
| 8. Cambio | `/cambio "X"` | `spec-writer` | "No toques código: actualiza primero la spec y muestra el diff." | `spec.md` |

## Notación EARS

- `RF-1: CUANDO <evento>, EL SISTEMA <respuesta>.`
- `RF-2: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
- `RF-3: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
- `RF-4: EL SISTEMA <comportamiento permanente>.`

## Estados de una spec

`borrador` → `revisada` → `aprobada` → `implementada`.

Solo se implementa con `aprobada`. Un cambio de alcance vuelve a `revisada`.
