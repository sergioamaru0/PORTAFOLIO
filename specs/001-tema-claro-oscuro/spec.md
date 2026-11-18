# Spec 001 — Tema claro/oscuro consistente

> Reemplazada por `specs/003-identidad-visual` el 2026-11-13. Se conserva como histórico.

Estado: reemplazada por la 003
Tipo: spec-anchored
Fecha: 2026-11-12

## Contexto y objetivo

El sitio aplica modo oscuro solo por `prefers-color-scheme`, sin control del usuario ni
persistencia. Además, `Layout.astro` fija `body { background: #262525 }` y los componentes
usan colores de paleta sueltos, por lo que el modo claro y el oscuro no son coherentes entre
sí. El objetivo es un sistema de tema único, con tokens semánticos, preferencia persistente,
sin flash al cargar y con contraste AA en ambos temas.

## Usuarios / actores

- Visitante que llega desde el sistema operativo en modo claro u oscuro.
- Visitante que quiere forzar un tema concreto.
- Desarrollador y agentes que añaden componentes nuevos.

## Historias de usuario

- H1: Como visitante quiero que el sitio respete el tema de mi sistema para no deslumbrarme.
- H2: Como visitante quiero cambiar el tema y que se recuerde entre visitas.
- H3: Como desarrollador quiero tokens semánticos para no duplicar clases `dark:`.

## Requisitos funcionales (EARS)

- RF-1: CUANDO un visitante abre el sitio sin preferencia guardada, EL SISTEMA aplica el
  tema del sistema operativo.
- RF-2: CUANDO el visitante selecciona claro u oscuro, EL SISTEMA aplica el tema y lo
  persiste en `localStorage`.
- RF-3: MIENTRAS el visitante no haya elegido un tema explícito, EL SISTEMA sigue los
  cambios de `prefers-color-scheme` sin recargar.
- RF-4: EL SISTEMA declara `color-scheme: light` en tema claro y `color-scheme: dark` en
  tema oscuro.
- RF-5: CUANDO se carga cualquier página, EL SISTEMA aplica el tema antes del primer pintado,
  sin flash de tema incorrecto.
- RF-6: SI el visitante activa `prefers-reduced-motion: reduce`, ENTONCES EL SISTEMA no
  anima la transición de tema.
- RF-7: EL SISTEMA mantiene contraste mínimo 4.5:1 en texto normal y 3:1 en UI en ambos temas.
- RF-8: CUANDO el tema cambia, EL SISTEMA actualiza `<meta name="theme-color">`.
- RF-9: EL SISTEMA ofrece un selector de dos estados —claro y oscuro— operable con teclado
  y con estado anunciado a lectores de pantalla.
- RF-10: EL SISTEMA usa exclusivamente tokens semánticos en `src/components`, `src/layouts`
  y `src/pages`.

## Requisitos no funcionales

- RNF-1: El script de tema es inline, bloqueante y menor de 1 KB.
- RNF-2: No añade dependencias de runtime ni frameworks de cliente.
- RNF-3: No provoca layout shift (CLS) al cambiar de tema.
- RNF-4: La preferencia se sincroniza entre pestañas abiertas.
- RNF-5: Funciona con JavaScript deshabilitado mostrando el tema del sistema.

## Casos límite

- `localStorage` bloqueado o no disponible (modo privado): el sitio debe seguir funcionando.
- Preferencia guardada inválida (`"blue"`): se ignora y se usa el sistema.
- Cambio de tema del sistema con el sitio abierto y sin preferencia guardada.
- Cambio de tema del sistema con una preferencia explícita guardada: no debe cambiar.
- Dos pestañas con preferencias distintas: la última acción gana y se sincroniza.

## Fuera de alcance

- Rediseño visual completo o cambio de identidad de marca.
- Estado «sistema» dentro del selector: la primera visita sigue el sistema operativo, pero
  el control solo alterna entre claro y oscuro.
- Temas adicionales (sepia, alto contraste personalizado).
- Persistencia en servidor o cuenta de usuario.
- Generación automática de paletas.

## Criterios de finalización

- Todos los RF verificados con evidencia.
- `npm run check` y `npm run build` en verde.
- Matriz de 5 viewports × 2 temas sin overflow horizontal.
- Lighthouse Accessibility ≥ 95 en móvil, en claro y en oscuro.

## Validación

| Requisito | Cómo se verifica | Evidencia |
|---|---|---|
| RF-1 | Emular `prefers-color-scheme` claro/oscuro sin preferencia guardada | captura + `data-theme` |
| RF-2 | Seleccionar tema, recargar y comprobar persistencia | captura + `localStorage` |
| RF-3 | Cambiar emulación del sistema con el sitio abierto | captura |
| RF-4 | `getComputedStyle(document.documentElement).colorScheme` | valor light/dark |
| RF-5 | Captura con red limitada y tema oscuro guardado | captura sin flash |
| RF-6 | `emulate({ prefersReducedMotion: "reduce" })` | captura |
| RF-7 | Cálculo de contraste de tokens y Lighthouse | informe |
| RF-8 | Inspección del `meta[name=theme-color]` | valor por tema |
| RF-9 | Navegación con Tab y `aria-pressed` | captura + DOM |
| RF-10 | `npm run lint:tokens` | salida verde |

## Decisiones cerradas

- 2026-11-12 · Tema inicial: el del sistema operativo cuando no hay preferencia guardada.
- 2026-11-12 · Selector de dos estados: claro y oscuro. No hay vuelta a «sistema» desde el
  control; para eso se borran los datos del sitio.
- 2026-11-12 · PDFs personales: se mantienen con `X-Robots-Tag: noindex, nofollow`.
- 2026-11-12 · Dominio: se usará el subdominio `*.netlify.app` hasta que exista dominio
  propio. Afecta a la spec 002, no a esta.

## Dudas abiertas

Ninguna. La spec queda lista para planificación.
