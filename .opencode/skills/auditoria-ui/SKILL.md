---
name: Auditoría UI
description: Matriz responsive, temas, accesibilidad y rendimiento con Chrome DevTools MCP
---

# Auditoría UI

Verificación real en navegador. Sin capturas ni medidas, no hay auditoría.

## Preparación

1. `npm run build` — se audita el build, no el dev server.
2. `npm run preview` y navega a `http://localhost:4321`.
3. Confirma que el MCP `chrome-devtools` está conectado.

## Matriz

| Ancho | Alto | Por qué |
|---|---|---|
| 320 | 640 | mínimo real |
| 375 | 812 | móvil estándar |
| 768 | 1024 | tablet vertical |
| 1024 | 768 | portátil |
| 1440 | 900 | escritorio |

Cada ancho en `colorScheme: "light"` y `colorScheme: "dark"`.

## Emulación

`emulate` reemplaza **todos** los ajustes en cada llamada. Pasa siempre el conjunto completo:

```js
emulate({ viewport: "375x812x2,mobile,touch", colorScheme: "dark", prefersReducedMotion: "no-preference" })
```

Si omites `colorScheme` en una llamada posterior, se resetea a `auto`. Ese es el error más
común al auditar temas.

## Comprobaciones automáticas

Overflow horizontal:

```js
evaluate_script({
  function: `() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`
})
```

Tema efectivo:

```js
evaluate_script({
  function: `() => ({
    theme: document.documentElement.dataset.theme ?? null,
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
    background: getComputedStyle(document.body).backgroundColor
  })`
})
```

Encabezados:

```js
evaluate_script({
  function: `() => Array.from(document.querySelectorAll("h1,h2,h3")).map(h => h.tagName + ": " + h.textContent.trim())`
})
```

Foco:

```js
evaluate_script({
  function: `() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { tag: el.tagName, outline: s.outline, boxShadow: s.boxShadow };
  }`
})
```

## Comprobaciones manuales

- Recorrer la página con Tab: el foco se ve en todos los elementos interactivos.
- Cambiar de tema: sin flash, sin layout shift, `theme-color` actualizado.
- Con `prefersReducedMotion: "reduce"`: el cambio de tema no anima.
- Zoom a 200 %: nada se solapa ni se corta.
- Leer el DOM con `take_screenshot` en cada combinación de la matriz.

## Lighthouse

Ejecuta `lighthouse_audit` en móvil con el tema por defecto y con el tema alternativo.
Anota: Performance, Accessibility, Best Practices, SEO, LCP, CLS, INP.

Umbrales del proyecto: Accessibility ≥ 95, Performance ≥ 90, CLS < 0.1, LCP < 2.5 s.

## Informe

`docs/audits/YYYY-MM-DD-ui.md`:

```markdown
# Auditoría UI — YYYY-MM-DD

Build: <commit>
Navegador: Chrome <versión>

## Matriz

| Ancho | Claro | Oscuro | Overflow | Notas |
|---|---|---|---|---|
| 320 | OK | OK | no | |

## Lighthouse

| Tema | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|

## Hallazgos

| Severidad | Ubicación | Problema | Criterio |
|---|---|---|---|
```

## Límites

No editas código. Si un hallazgo es de implementación, lo describes y paras. El arreglo es
una tarea nueva o una task existente de la spec.
