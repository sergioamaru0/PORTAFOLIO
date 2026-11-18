# Portafolio — Sergio Bareño

Portafolio personal estático construido con **Astro 4**, **Tailwind CSS 3** y **TypeScript**,
desplegado en **Netlify**. Sin backend, sin base de datos y sin autenticación.

El proyecto se desarrolla con **Spec-Driven Development (SDD)** en modo *spec-anchored*:
ningún cambio en `src/` existe sin una especificación aprobada que lo respalde.

## Stack

| Pieza | Versión |
|---|---|
| Astro | 4.15 |
| Tailwind CSS | 3.4 |
| TypeScript | 5.6 |
| Node | 22 (`.nvmrc`) |
| Hosting | Netlify (Git integration) |

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # http://localhost:4321
npm run check        # astro check (tipos y plantillas)
npm run build        # astro check + astro build -> dist/
npm run preview      # servir dist/ en local
npm run audit:seo    # informe SEO sobre dist/
npm run audit:seo:strict  # falla si hay errores SEO
npm run lint:tokens  # prohíbe colores de paleta en componentes
```

## Flujo de trabajo

```
Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio
```

| Paso | Comando | Artefacto |
|---|---|---|
| Constitución | `/constitucion` | `docs/constitution.md` |
| Especificación | `/spec "idea"` | `specs/NNN-slug/spec.md` |
| Clarificación | `/clarificar NNN-slug` | `Dudas abiertas` |
| Planificación | `/plan NNN-slug` | `plan.md` |
| Tareas | `/tareas NNN-slug` | `tasks.md` |
| Implementación | `/implementar NNN-slug Tn` | `src/` + `tasks.md` |
| Validación | `/validar NNN-slug` | informe + evidencia |
| Cambio | `/cambio "requisito"` | `spec.md` |

Reglas del flujo:

- Una tarea por invocación. Se verifica y el agente **se detiene**.
- Los requisitos se escriben en **EARS**, no en Gherkin.
- Un requisito nuevo actualiza la spec **antes** que el código.
- Si falta una decisión, se pregunta. No se inventa.

## Estructura

```
├── src/
│   ├── pages/          rutas
│   ├── components/     componentes .astro
│   ├── layouts/        layout base
│   ├── assets/         imágenes y documentos
│   └── styles/         tokens y estilos globales
├── specs/              especificaciones, planes y tareas
│   ├── _plantilla/     plantillas canónicas
│   └── 001-…/          una carpeta por funcionalidad
├── docs/
│   ├── constitution.md principios innegociables
│   ├── flujo-sdd.md    método y prompts por fase
│   ├── memoria.md      estado actual del proyecto
│   ├── adr/            decisiones de arquitectura
│   └── audits/         evidencia de auditorías
├── scripts/            verificaciones deterministas
└── .opencode/          agentes, comandos y skills
```

## Calidad

Cada tarea termina con verificación real:

| Nivel | Herramienta |
|---|---|
| Tipos y build | `npm run check`, `npm run build` |
| Tokens de diseño | `npm run lint:tokens` |
| SEO | `npm run audit:seo:strict` |
| Navegador | Chrome DevTools MCP (5 viewports × 2 temas) |
| Manual | revisión visual con evidencia en `docs/audits/` |

Umbrales: WCAG 2.2 AA, Lighthouse Accessibility ≥ 95, Performance ≥ 90, CLS < 0.1,
LCP < 2.5 s, sin overflow horizontal desde 320 px.

## Despliegue

- `main` publica producción.
- Cada pull request genera un deploy preview automático.
- Ningún agente despliega a producción: eso lo decide un humano con el merge.
- Los secretos viven en variables de entorno de Netlify, nunca en el repositorio.

## Estado

Ver [`docs/memoria.md`](docs/memoria.md) para el foco actual, los bloqueos y la deuda
conocida. Ver [`docs/adr/`](docs/adr) para las decisiones y su justificación.
