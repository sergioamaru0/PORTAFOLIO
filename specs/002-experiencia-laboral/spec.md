# Spec 002 — Experiencia laboral

Estado: aprobada
Tipo: spec-anchored
Fecha: 2026-11-13

## Contexto y objetivo

La sección de experiencia laboral funciona a medias. `src/components/Experience.astro` mantiene
un arreglo `EXPERIENCE` con tres vínculos cuyos datos mezclan cargo y empresa en un solo campo;
`src/components/ExperienceItem.astro` recibe una prop `dowload` que nunca se usa y su botón solo
renderiza `href`, sin atributo `download`, con el texto genérico «Saber más». La hoja de vida se
enlaza a `/src/assets/hv/Hoja_de_Vida_sergio_bareno.pdf`, una ruta que no existe en `dist/` tras
el build y por tanto devuelve 404 en producción. Además hay un cuarto PDF,
`src/assets/certificatework/CartaLaboralStaffing.pdf`, que no se importa en ningún archivo de
`src/` ni está rastreado por git, y el hero afirma «+1 año de experiencia» mientras las fechas
listadas cubren de abril de 2023 a julio de 2026. El objetivo es que cada vínculo autorizado se
presente con cargo, empresa, periodo y funciones; que cada certificado se pueda ver y descargar
desde una URL que exista en el build; que la hoja de vida sea descargable; y que la cifra de años
del hero no contradiga la cronología publicada.

## Usuarios / actores

- Visitante y reclutador que revisa la trayectoria y quiere verificar un certificado.
- Sergio, que mantiene el contenido y decide qué documentos se publican.
- Agentes y desarrolladores que añaden vínculos y PDFs nuevos.

## Historias de usuario

- H1: Como reclutador quiero ver cargo, empresa, periodo y funciones de cada vínculo para evaluar
  la trayectoria de un vistazo. Criterio: RF-1.
- H2: Como reclutador quiero abrir el certificado de un vínculo sin perder el portafolio para
  contrastar la información. Criterio: RF-2.
- H3: Como reclutador quiero descargar el certificado con un nombre de archivo legible para
  adjuntarlo a un proceso interno. Criterio: RF-3.
- H4: Como visitante quiero que la hoja de vida y los certificados existan de verdad para no
  encontrarme un 404. Criterio: RF-4, RF-5, RF-6.
- H5: Como Sergio quiero que un vínculo sin documento autorizado no muestre botón para no
  publicar enlaces muertos ni documentos que no he aprobado. Criterio: RF-7.
- H6: Como Sergio quiero añadir un vínculo editando solo datos para no tocar componentes.
  Criterio: RF-10.

## Requisitos funcionales (EARS)

- RF-1: EL SISTEMA muestra una entrada de experiencia por cada vínculo declarado en los datos,
  con cargo, empresa, periodo y funciones identificables por separado.
- RF-2: CUANDO el visitante activa el botón de ver un certificado, EL SISTEMA abre el PDF en una
  pestaña nueva con `rel="noopener noreferrer"` y sin navegar fuera del portafolio.
- RF-3: CUANDO un vínculo tiene un documento autorizado y descargable, EL SISTEMA ofrece un botón
  de descarga con el atributo `download` y un nombre de archivo legible, sin hashes ni guiones
  bajos del nombre interno.
- RF-4: EL SISTEMA sirve los PDF de experiencia y la hoja de vida como assets importados, de modo
  que cada archivo autorizado exista en `dist/` con la ruta que emite el build.
- RF-5: EL SISTEMA no publica ningún enlace a rutas bajo `/src/`; toda referencia a un PDF usa la
  ruta del build.
- RF-6: CUANDO el visitante activa el enlace de la hoja de vida, EL SISTEMA entrega el PDF
  presente en `dist/` con nombre de archivo legible y la descarga se completa.
- RF-7: SI un vínculo no tiene certificado autorizado para publicación, ENTONCES EL SISTEMA no
  muestra ningún botón de ver ni de descargar para ese vínculo.
- RF-8: EL SISTEMA mantiene la cifra de años de experiencia del hero coherente con las fechas de
  las entradas publicadas, sin afirmar más años de los que cubre la cronología.
- RF-9: MIENTRAS los PDF personales se sirvan desde `/_astro/`, EL SISTEMA los entrega con
  `X-Robots-Tag: noindex, nofollow`.
- RF-10: EL SISTEMA obtiene las entradas de experiencia de una fuente de datos declarativa, de
  forma que añadir un vínculo requiera editar solo los datos del vínculo y el import de su PDF,
  sin modificar la estructura de los componentes.

## Requisitos no funcionales

- RNF-1: Sin dependencias nuevas y sin JavaScript de cliente añadido para la sección.
- RNF-2: Los botones tienen texto significativo que nombra la acción y la empresa; el icono, si
  existe, queda con `aria-hidden`.
- RNF-3: Foco visible en ambos temas y área táctil mínima de 24 × 24 px CSS.
- RNF-4: Contraste mínimo 4.5:1 en texto y 3:1 en elementos de interfaz, en tema claro y oscuro.
- RNF-5: Sin overflow horizontal en 320, 375, 768, 1024 y 1440 px.
- RNF-6: Ningún PDF se sirve desde rutas de `src/` ni con nombre de archivo que exponga datos
  personales nuevos no autorizados.

## Casos límite

- PDF con espacios y acentos en el nombre (`certificado _laboral_servimax.pdf`,
  `CARTA DE RECOMENDACIÓN SERGIO ANDRES BAREÑO CUBILLOS.pdf`): el import y la URL del build
  deben funcionar, y el nombre de descarga debe ser legible y sin caracteres problemáticos.
- Certificado duplicado para el mismo vínculo: se publica un solo par de botones, no dos.
- Vínculo sin certificado autorizado: la entrada se muestra sin botón, no con un enlace muerto.
- Documento presente en el repositorio pero no autorizado: no se importa, no se publica y no
  aparece en `dist/`.
- PDF presente en disco pero no rastreado por git: el build de integración no lo tendría; debe
  quedar fuera de la publicación hasta que se autorice y se añada al repositorio.
- Enlace externo roto o PDF ausente del build: se detecta en la verificación; no se publica.
- Fechas solapadas o periodos incompletos en los datos: la cifra del hero no puede superar el
  intervalo real cubierto por las entradas.

## Fuera de alcance

- Rediseño visual de la sección o de la página (spec 003, identidad visual).
- Metadatos, datos estructurados y SEO de la página (spec 004).
- Tema claro/oscuro y tokens semánticos (spec 003).
- CMS, contenido externo o edición desde el navegador.
- Textos del hero distintos de la cifra de años de experiencia.
- Cualquier PDF personal que Sergio no autorice publicar.

## Criterios de finalización

- Todos los RF verificados con evidencia en `docs/audits/`.
- `npm run check` y `npm run build` en verde.
- Se publican los 4 vínculos o solo los autorizados, y cada botón de documento resuelve a un
  archivo existente en `dist/`.
- En `npm run preview`, todos los enlaces de PDF de experiencia y de la hoja de vida responden
  200; ninguno contiene `/src/`.
- Sin overflow horizontal en 320, 375, 768, 1024 y 1440 px.

## Validación

| Requisito | Cómo se verifica | Evidencia |
|---|---|---|
| RF-1 | Contar entradas en `#experiencia` y comprobar cargo, empresa, periodo y funciones | captura + HTML del build |
| RF-2 | Activar el botón de certificado y comprobar pestaña nueva y `rel` | captura + DOM |
| RF-3 | Inspeccionar `download` y el nombre propuesto en el HTML del build | captura + HTML |
| RF-4 | Listar `dist/_astro/*.pdf` y comparar con los PDF autorizados | salida de `npm run build` |
| RF-5 | Buscar `/src/` en `dist/` y en el HTML generado | salida de búsqueda vacía |
| RF-6 | Descargar la hoja de vida desde `npm run preview` | captura + archivo descargado |
| RF-7 | Revisar un vínculo sin documento autorizado en el HTML del build | captura + HTML |
| RF-8 | Comparar la cifra del hero con las fechas de las entradas | captura + cita de las fechas |
| RF-9 | Consultar cabeceras del PDF con `curl -I` sobre la preview | cabeceras `X-Robots-Tag` |
| RF-10 | Diff de un vínculo de prueba: solo datos e import | diff + captura |

## Decisiones cerradas

- 2026-11-13 · Staffing es la empresa; el cargo es desarrollador fullstack.
- 2026-11-13 · Se autoriza publicar `CartaLaboralStaffing.pdf` en el sitio.
- 2026-11-13 · Ese documento se publica como certificado laboral.
- 2026-11-13 · La carta de ALG CREATION también se publica como certificado: no se distingue
  entre «certificado» y «recomendación» en la etiqueta del botón.
- 2026-11-13 · La cifra del hero será «+ de 2 años».
- 2026-11-13 · El correo `sergiobaredo2904@gmail.com` es correcto; no se cambia.
- 2026-11-13 · Staffing: abril de 2026 a julio de 2026, el vínculo más reciente.
- 2026-11-13 · Funciones de Staffing: desarrollo fullstack con PHP y Phalcon en el backend y
  React con Next.js en el frontend, más ajustes de seguridad OWASP y BOLA.
- 2026-11-13 · Las entradas se ordenan de la más reciente a la más antigua; Staffing va
  primero.

## Dudas abiertas

Ninguna. La spec queda lista para aprobación y planificación.
