---
description: Prepara un deploy preview en Netlify sin tocar producción
agent: deployer
subagent: true
---

Prepara un deploy preview para la rama actual. Se lanza solo cuando el humano ya ha dado
la confirmación que haga falta: tú no puedes preguntar.

1. `npm run check` y `npm run build`. Si fallan, detente y muestra la salida.
2. Verifica la rama. Si es `main`, detente: no se despliega producción desde aquí.
3. Crea el commit con mensaje convencional si hay cambios sin commitear.
4. Sube la rama con `git push -u origin <rama>`. Nunca `main`, nunca `--force`.
5. Consulta el estado del deploy preview por el MCP de Netlify.

**No promociones a producción.** No modifiques el sitio publicado. Si la acción que
necesitas es destructiva o irreversible, pídeme confirmación explícita.

Devuelve la URL del preview, el commit y qué se verificó.
