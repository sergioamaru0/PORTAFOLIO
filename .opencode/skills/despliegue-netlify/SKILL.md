---
name: Despliegue Netlify
description: Flujo de preview y producción en Netlify por Git integration, sin tocar main desde agentes
---

# Despliegue Netlify

El sitio se despliega por **Git integration** de Netlify: `main` publica producción y cada
pull request genera un deploy preview. No hay deploy manual desde un agente.

## Configuración esperada

`netlify.toml` en la raíz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

- Node fijado a la versión de `.nvmrc` y `package.json` (`engines`).
- `publish = "dist"` — Astro genera `dist/`, no `build/`.
- Headers de seguridad y de caché en el mismo archivo.

## Flujo del agente `deployer`

1. Rama actual != `main`. Si es `main`, se detiene.
2. `npm run check` y `npm run build` en verde.
3. Commit con mensaje convencional.
4. `git push -u origin <rama>`.
5. Consulta el deploy preview por el MCP de Netlify.
6. Devuelve la URL del preview.

Producción: el humano hace merge del PR. Un agente nunca pulsa "deploy production".

## Reglas duras

- Nunca `git push` a `main`.
- Nunca `--force` ni `--force-with-lease`.
- Nunca promocionar un preview a producción sin confirmación escrita del humano.
- Nunca desactivar branch protection, headers o redirects para "que funcione".
- Los secretos viven en variables de entorno de Netlify, no en el repo.
  En `opencode.jsonc` solo se referencian con `{env:VAR}`.

## Qué verificar en un preview

- La URL responde 200 en `/`.
- El tema claro y oscuro cargan sin flash.
- `robots.txt` y sitemap responden.
- Los headers de seguridad están presentes (`X-Frame-Options`, `X-Content-Type-Options`).
- No hay `noindex` inesperado.
- Lighthouse rápido: Performance y Accessibility sin caídas.

## Errores típicos

| Síntoma | Causa habitual |
|---|---|
| Build falla solo en Netlify | versión de Node distinta |
| 404 en todas las rutas | `publish` mal configurado |
| CSS sin cargar | `base`/`site` mal en `astro.config.mjs` |
| Preview privado | deploy previews protegidos por contraseña en Netlify |
| Variables vacías | no definidas en el panel de Netlify |

## MCP de Netlify

Se usa para consultar proyectos, deploys y estado. Cualquier operación de escritura requiere
confirmación explícita. Si el MCP no está autenticado, se pide al humano ejecutar `/mcps` y
firmar; el agente no maneja credenciales.
