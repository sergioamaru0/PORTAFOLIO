# ADR-0002 — Agente orquestador único

- Fecha: 2026-11-13
- Estado: aceptada

## Contexto

El arnés tenía seis subagentes pero ningún dueño del flujo: el humano hablaba con el agente
que estuviera activo y cada comando cambiaba ese agente (`agent:`). Con `/implementar` la
sesión pasaba a `build`, que escribía código con permisos amplios. No había un punto único
donde decidir a quién delegar ni donde consolidar la evidencia.

## Decisión

Un primario `orchestrator` como interlocutor único, con `default_agent` apuntando a él:

- `mode: primary` y sin `model`: hereda el modelo de la sesión.
- Escribe `specs/**` y `docs/**`; nunca `src/`, `public/` ni configuración.
- No hace `git add`, `commit` ni `push`: eso es de `deployer`.
- Solo lanza los subagentes de su lista; Netlify y Chrome DevTools le están denegados.
- Conduce las entrevistas (`/spec`) porque un subagente no puede preguntar al humano.
- Nuevo subagente `implementer`: único que edita `src/`, sin permisos de git de escritura.
- Los comandos dejan de fijar `agent:`: el orquestador despacha y la sesión no cambia.

## Alternativas descartadas

- **`build` como primario**: permisos amplios para todo y sin separación entre decidir,
  implementar y desplegar; el humano no tiene un punto único de coordinación.
- **Orquestador que también edita código**: concentra trabajo y permisos en un solo agente y
  rompe la regla de que solo un rol escribe `src/`.
- **Varios primarios**: el humano elige quién responde en cada momento; vuelve el problema de
  no saber quién manda ni quién consolida.
- **Entrevista delegada a `spec-writer`**: el subagente no puede preguntar; devolvería una
  spec con huecos o un informe en vez de seis preguntas.

## Consecuencias

- `default_agent: orchestrator`; `build` sigue disponible como respaldo manual.
- Los subagentes corren en segundo plano y reportan: el orquestador espera y resume.
- La confirmación de producción la pide el orquestador antes de lanzar `deployer`.
- Coste: la tabla de reparto debe mantenerse en el mismo orden en `AGENTS.md`,
  `docs/flujo-sdd.md` y el prompt del orquestador.
