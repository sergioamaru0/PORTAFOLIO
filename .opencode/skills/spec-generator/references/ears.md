# Notación EARS

EARS (*Easy Approach to Requirements Syntax*) describe el comportamiento en lenguaje
natural controlado. En este proyecto los RF se numeran `RF-1`, `RF-2`…

## Los cuatro patrones

| Patrón | Cuándo usarlo | Plantilla |
|---|---|---|
| Ubicuo | Comportamiento permanente, sin evento | `EL SISTEMA <respuesta>.` |
| Evento | Reacción a algo que ocurre | `CUANDO <evento>, EL SISTEMA <respuesta>.` |
| Estado | Comportamiento mientras dura un estado | `MIENTRAS <estado>, EL SISTEMA <respuesta>.` |
| No deseado | Manejo de errores o condiciones inválidas | `SI <condición>, ENTONCES EL SISTEMA <respuesta>.` |
| Opcional | Solo si la feature está presente | `DONDE <feature>, EL SISTEMA <respuesta>.` |

## Reglas

1. Un RF = un comportamiento observable.
2. Sujeto siempre `EL SISTEMA` (o el componente concreto: `EL SELECTOR DE TEMA`).
3. Verbo en presente, tercera persona, sin "debería" ni "podría".
4. La respuesta debe ser observable: algo que se pueda medir, ver o comprobar.
5. Sin condiciones compuestas con "y" dentro del evento. Divide en dos RF.
6. Sin detalles de implementación: nada de nombres de archivos, funciones ni librerías.

## Ejemplos

Bien:

```text
RF-1: CUANDO un visitante abre el sitio sin preferencia guardada, EL SISTEMA aplica el tema del sistema operativo.
RF-2: SI el valor guardado en localStorage no es válido, ENTONCES EL SISTEMA ignora la preferencia y usa el tema del sistema.
RF-3: MIENTRAS el visitante está en modo "sistema", EL SISTEMA sigue los cambios de prefers-color-scheme sin recargar.
RF-4: EL SISTEMA declara color-scheme: light en tema claro y color-scheme: dark en tema oscuro.
```

Mal:

```text
RF-1: El sistema debe ser moderno y usable.               ← no verificable
RF-2: Cuando el usuario hace clic, se ejecuta toggleTheme() en el componente.  ← implementación
RF-3: Dado que el usuario está en modo oscuro, cuando recarga, entonces se mantiene. ← Gherkin
RF-4: El sistema aplica el tema y guarda la preferencia y sincroniza pestañas.   ← tres comportamientos
```

## Cómo saber que un RF está bien

Pregúntate: *¿qué comando, captura o comprobación demuestra que se cumple?*
Si la respuesta no existe, el RF no sirve.
