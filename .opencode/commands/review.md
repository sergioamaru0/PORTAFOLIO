---
description: Revisa el diff actual contra la spec y las reglas del proyecto
agent: reviewer
subagent: true
---

Revisa los cambios actuales del repositorio.

Contexto adicional: $ARGUMENTS

Comprueba, en este orden:

1. **Alcance**: ¿qué RF de la spec activa cubre el cambio? Si no cubre ninguno, es un
   hallazgo bloqueante.
2. **Corrección**: errores, casos límite, estados no contemplados, regresiones.
3. **Accesibilidad**: contraste, foco visible, teclado, un solo `h1`, `alt` descriptivo.
4. **Tokens**: ningún `bg-white`, `text-black`, `bg-gray-*` ni hex crudo en componentes.
5. **SEO**: title, description, canonical, `lang`.
6. **Seguridad**: secretos, datos personales, enlaces externos sin `rel`.

Salida: hallazgos por severidad (`bloqueante` / `importante` / `menor`) con `archivo:línea`
y el criterio incumplido. Si no hay hallazgos, dilo en una línea. No edites nada.
