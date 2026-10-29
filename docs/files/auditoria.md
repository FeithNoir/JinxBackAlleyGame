# Auditoría — Jinx's Back-Alley Game

**Fecha:** 28/10/2026 · **Versión auditada:** `0.0.1-alpha.1` (commit `f1dbccc`) · **Rama de mejoras:** `feat/mejoras-auditoria`

**Stack:** Angular 19 (componentes standalone + signals), CSS propio "neobrutalista", Electron 40 opcional (`main.js`/`preload.js`), backend opcional Express + Prisma + SQLite (`backend/`, no conectado al frontend).

**Qué es:** novela visual / point-and-click para adultos. El jugador conversa con Jinx en un callejón de Zaun; un medidor de **caos** desbloquea opciones y reacciones; el personaje está compuesto por capas PNG (cuerpo, ropa, brazos, expresiones, efectos). Hay un **modo Arcade** (vestidor/sandbox) y un mini-juego de clics.

**Método:** build de producción (`ng build`), servidor estático local, Playwright/Chromium en 6 viewports (360×800, 390×844, 844×390 horizontal, 768×1024, 1366×768, 1920×1080), recorrido completo de la historia, prueba de teclado, muestreo de FPS/memoria, `gitleaks` sobre árbol e historial.

> **Nota sobre capturas:** `public/*` está en `.gitignore`, así que **el repositorio no incluye fondos, sprites ni música**. Ninguna captura muestra arte explícito (no existe en el repo); se ven los estados de la UI con imágenes faltantes. No fue necesario difuminar nada.

Severidad: 🔴 Crítica · 🟠 Alta · 🟡 Media · 🟢 Baja

---

## 1. Como jugador común

| # | Hallazgo | Sev. | Evidencia |
|---|---|---|---|
| J1 | La historia **se rompe a los ~6 clics**: todas las ramas del Acto I llevan al nodo `5`, que no existe; el repositorio devuelve el nodo 9999 ("This dialogue hasn't been written yet") y vuelve al inicio. | 🔴 | `src/app/core/data/dialogues.ts` (nextNodeId: 5 en 3, 4, 6, 7, 231–243) |
| J2 | **No se ve al personaje ni el fondo**: imágenes rotas con texto alternativo superpuesto ("base", "eyes"…), logo roto en la cabecera. | 🔴 | `before-laptop-1366-game.png`, `before-phone-390-game.png` |
| J3 | **El progreso se pierde**: al entrar a la historia `MainComponent.ngOnInit()` llama `loadInitialState()` y sobrescribe la partida guardada. No existe "Continuar". | 🔴 | `pages/main/main.component.ts` |
| J4 | Los cambios de **vestuario/expresión del guion no se aplican** (p. ej. el traje de gato): los presets se aplican al `CharacterService` y acto seguido `setProps()` los pisa con el estado del nodo. | 🟠 | `game.service.ts › selectOption` |
| J5 | 6 presets usados por el guion no existen (`smirk`, `curious`, `nervous-happy`, `ecstatic`, `tease`, `lusty`, outfit `naked-top`) → se ignoran en silencio. | 🟠 | `character.service.ts` |
| J6 | La música del juego nunca suena: `MusicService` espera la ruta `/history`, pero la ruta real es `/game`. Además el autoplay se bloquea y no se reintenta. | 🟡 | `music.service.ts`; aviso en consola en los 6 viewports (`docs/files/qa-before-report.json`) |
| J7 | En móvil (≤768 px) el botón **NEXT queda bajo el pliegue** o tapado por el pie; en horizontal (844×390) el panel no cabe y no se puede desplazar. | 🟠 | `before-phone-390-game.png`, `before-phone-390-land-game.png` |
| J8 | Las zonas táctiles del personaje tienen tamaños **en px fijos** mientras el personaje escala con `vmin`: en móvil quedan desalineadas. | 🟡 | `character.component.css` |
| J9 | El panel **Settings está vacío** ("Settings UI elements will go here") y además queda **debajo** de la barra lateral (z-index 1000 vs 2001). | 🟡 | `settings.component.html`, `app.component.css` |
| J10 | Inventario con estética "terminal verde" que no pertenece a la identidad púrpura; iconos con ruta inexistente (`assets/icons/...`). | 🟡 | `inventory-modal.component.css`, `inventory-items.data.ts` |
| J11 | No hay finales, pistas ni objetivo claro: el medidor de caos sube pero no se sabe para qué. | 🟡 | — |

## 2. Como QA experto de aplicaciones web

### 2.1 Errores y consola
| # | Hallazgo | Sev. | Evidencia |
|---|---|---|---|
| Q1 | `NG0600` (escritura de signal dentro de `computed()`) al abrir el inventario con objetos. | 🟠 | `inventory-modal.component.ts › paginatedItems` (detectado en play-test) |
| Q2 | `Audio playback blocked: NotAllowedError` en todas las pantallas. | 🟢 | `docs/files/qa-before-report.json` |
| Q3 | Nodo 7 inalcanzable; nodo `9999` como "fallback" oculta errores de guion en lugar de detectarlos. | 🟡 | `dialogues.ts` |
| Q4 | `loadGame()` asíncrono en el constructor sin esperar: condición de carrera con `loadInitialState()`. | 🟡 | `game.service.ts` |
| Q5 | `INITIAL_GAME_STATE` se reutiliza por referencia (no se clona). | 🟢 | `game.service.ts` |

### 2.2 Rendimiento
| Métrica | Antes | Después |
|---|---|---|
| JS+CSS inicial (raw / transferido) | 386 KB / 102.6 KB | 329.9 KB / 93.3 KB (juego en chunks lazy) |
| Carga local hasta `networkidle` | ~630 ms | ~640 ms (sin cambio material) |
| FPS en escena (muestra 2 s, 1366×768) | 60 | 60 |
| Heap JS | — | ~20 MB |

* 🟡 **P1** Las capas del personaje son PNG (hasta ~15 capas por frame) sin `decoding="async"`, sin precarga del siguiente vestuario y sin formato moderno (WebP/AVIF). No se pudo medir el peso real: los assets no están versionados.
* 🟢 **P2** Fuentes `Bangers`/`Outfit` declaradas pero **nunca cargadas** (sin `<link>` ni `@font-face`): en equipos sin esas fuentes se ve una fuente genérica.
* 🟢 **P3** `electron` (40.x) es devDependency pesada (~100 MB+) para quien solo quiere la web; aceptable, documentarlo.

### 2.3 Accesibilidad
| # | Hallazgo | Sev. |
|---|---|---|
| A1 | Zonas interactivas del personaje son `<div (click)>`: no accesibles por teclado ni lector de pantalla. | 🟠 |
| A2 | Sin soporte de `prefers-reduced-motion`; vibración/flash/sacudidas constantes (riesgo fotosensible). | 🟠 |
| A3 | Texto alternativo técnico en las capas ("underwear bottom", "eyes") leído por lectores de pantalla y visible al fallar la imagen. | 🟡 |
| A4 | Sin estilos de foco visibles coherentes; modal sin `role="dialog"` ni cierre con Esc. | 🟡 |
| A5 | Objetivos táctiles < 44 px (botones "RETURN TO MENU", iconos de audio). | 🟡 |
| A6 | Contraste: texto de la burbuja (`#111` sobre lavanda) correcto; etiquetas amarillas pequeñas sobre azul oscuro OK; los botones cian con texto negro OK (> 7:1). Sin problemas graves. | 🟢 |

### 2.4 Guardado / progreso
* 🔴 J3 (se sobrescribe). 🟡 Botón 💾 sin feedback. 🟡 Sin versión de esquema ni tolerancia a partidas antiguas. 🟢 Electron guarda en `userData/game_data.json` correctamente.

### 2.5 SEO / meta / PWA
* 🟡 `<title>JinxBackalleyGame</title>`, sin `description`, `theme-color`, Open Graph ni `rating`. Para contenido adulto conviene **`noindex`** y marca `rating=adult`.
* 🟢 Favicon por defecto de Angular.
* 🟠 **No hay puerta de edad (18+)** pese al contenido explícito.

### 2.6 Seguridad / credenciales
* ✅ `gitleaks git` (23 commits) y `gitleaks dir`: **sin fugas**. `rg` de `api_key|secret|password|token|DATABASE_URL`: sin coincidencias reales.
* 🟢 `backend/dev.db` (SQLite vacía con el esquema) estaba versionada → se quitó del índice y se añadió `*.db` a `backend/.gitignore` (sigue en el historial; no contiene datos).
* 🟢 Enlace de Patreon con `target="_blank"` sin `rel="noopener"`; parámetros UTM innecesarios.
* 🟢 Backend con `cors()` abierto: aceptable en local, no para producción.

## 3. Gusto / dirección de arte

* **Originalidad (6/10):** la paleta "Purple Chaos" (púrpura #9333EA, amarillo #FFD600, cian #00BFFF) y el neobrutalismo con sombras duras encajan con Jinx y no se siente plantilla. Pero el **título es texto plano centrado sobre fondo negro + badge de shields.io**: parece prototipo/IA-scaffold. El README también tiene tono de documentación generada.
* **Coherencia (5/10):** tres lenguajes visuales compitiendo: neobrutalismo púrpura (sidebar), burbuja de cómic con fuente monoespaciada (diálogo) e inventario verde "hacker". La tipografía monoespaciada del diálogo no es de cómic.
* **Tipografía:** buena intención (Bangers + Outfit) pero no se cargan. Mayúsculas forzadas en todos los botones dificultan la lectura de opciones largas.
* **Dirección de arte del personaje:** sistema de capas bien pensado (orden z claro, efectos separados). Sin assets en el repo no se puede evaluar el dibujo.
* **Audio:** tres pistas previstas, sin SFX (clics, explosiones, inventario). Sin feedback sonoro.
* **Feedback:** el caos sube sin animación ni explicación; elegir una opción no tiene transición; no hay "¡Objeto obtenido!".
* **¿Parece hecho por IA?** La lógica y comentarios mezclados ("← NUEVO", "Added for inventory items") y el README sugieren asistencia de IA; la estética del juego en sí tiene personalidad suficiente para no parecerlo, si se completan título y assets.

## 4. Pantallas (antes)

| Viewport | Título | Juego | Observación |
|---|---|---|---|
| 360×800 | `before-phone-360-title.png` | `before-phone-360-game.png` | Controles bajo el pliegue |
| 390×844 | `before-phone-390-title.png` | `before-phone-390-game.png` | Igual |
| 844×390 | `before-phone-390-land-title.png` | `before-phone-390-land-game.png` | Panel cortado, sin scroll |
| 768×1024 | `before-tablet-768-title.png` | `before-tablet-768-game.png` | Layout móvil |
| 1366×768 | `before-laptop-1366-title.png` | `before-laptop-1366-game.png` | Imágenes rotas |
| 1920×1080 | `before-desktop-1920-title.png` | `before-desktop-1920-game.png` | Mucho espacio vacío |

## 5. Contenido

Se conserva todo el contenido adulto existente sin cambios. No se encontró texto que implique minoría de edad; se añadió aviso "todos los personajes son adultos (18+)" en la puerta de edad. Las escenas nuevas son sugerentes/fundido a negro.
