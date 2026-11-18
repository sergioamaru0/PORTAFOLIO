# Constitución — Portafolio

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **La spec manda (spec-anchored)**: ningún comportamiento se implementa si no está en la
   spec activa. Si falta una decisión, se detiene el trabajo y se pregunta.
2. **Estático y simple**: Astro + Tailwind, sin backend ni base de datos. Cada dependencia
   nueva exige un ADR con la alternativa descartada.
3. **Accesibilidad AA**: WCAG 2.2 AA en ambos temas. El contraste, el foco y la navegación
   por teclado no se negocian por estética.
4. **Performance primero**: JavaScript de cliente mínimo, imágenes optimizadas y ninguna
   librería que no aporte valor medible.
5. **Privacidad por defecto**: nada personal indexable sin decisión explícita. Los secretos
   viven en variables de entorno, nunca en el repositorio.
6. **Verificación como puerta**: cada tarea termina con build verde y evidencia. Prohibido
   avanzar con la verificación en rojo.
