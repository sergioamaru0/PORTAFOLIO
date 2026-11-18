---
name: Spec Generator
description: Entrevista al usuario y escribe especificaciones en notación EARS para specs/NNN-slug/spec.md
---

# Spec Generator

Convierte una idea vaga en una especificación verificable. Solo el QUÉ y el POR QUÉ.
Nunca código, nunca solución técnica.

## Cuándo usarla

- Al empezar una funcionalidad nueva (`/spec`).
- Al revisar una spec como QA (`/clarificar`).
- Al añadir un requisito a una spec existente (`/cambio`).

## Procedimiento

### 1. Contexto antes de preguntar

Lee, en este orden:

1. `AGENTS.md` y `docs/constitution.md` (límites del proyecto).
2. `docs/memoria.md` (estado actual y bloqueos).
3. `specs/` (para elegir el siguiente número y no duplicar alcance).
4. El código relevante solo si necesitas saber qué existe hoy.

### 2. Entrevista

Máximo **seis preguntas, de una en una**. Espera la respuesta antes de la siguiente.
Empieza por la que más cambie el diseño.

Orden recomendado:

| # | Pregunta | Qué desbloquea |
|---|---|---|
| 1 | ¿Qué problema real resuelve y para quién? | objetivo |
| 2 | ¿Qué pasa hoy y por qué no vale? | contexto |
| 3 | ¿Qué es "hecho" para ti, en una frase? | criterio de aceptación |
| 4 | ¿Qué casos raros o estados vacíos se te ocurren? | casos límite |
| 5 | ¿Qué queda explícitamente fuera? | alcance |
| 6 | ¿Hay restricciones técnicas o de datos que no se puedan cambiar? | límites |

Reglas:

- Una pregunta por mensaje. Nada de cuestionarios de seis puntos.
- Si la respuesta es "no sé", no la rellenes: va a `Dudas abiertas`.
- No propongas implementación. Si el usuario la pide, responde "eso va en el plan".

### 3. Escribir la spec

Usa `specs/_plantilla/spec.md` y numera el directorio con el siguiente `NNN`.
El estado inicial es `borrador`.

Los requisitos funcionales van en EARS. Ver `references/ears.md`.

Cada RF debe poder verificarse. Si no se puede verificar con un comando, una captura o
una comprobación manual descrita, no es un requisito.

### 4. Clarificar

Al revisar una spec, busca **solo defectos**:

- Ambigüedades ("rápido", "bonito", "moderno").
- Requisitos no verificables.
- Contradicciones entre RF.
- Casos límite ausentes: vacío, error, sin permiso, sin datos, doble acción.
- Conflictos con la constitución.
- Requisitos escondidos en "Fuera de alcance".

No resuelvas. Escribe cada duda en `Dudas abiertas` con `[NECESITA ACLARACIÓN]` y pasa el
estado a `revisada`.

## Antipatrones

- EARS con condiciones múltiples en un solo RF. Divide.
- "El sistema debe ser accesible" sin criterio medible.
- Copiar requisitos de otra spec sin comprobar que aplican.
- Escribir el plan dentro de la spec.
- Gherkin disfrazado de EARS.

## Referencias

- `references/ears.md` — patrones, verbos y ejemplos correctos e incorrectos.
- `specs/_plantilla/spec.md` — plantilla canónica.
