# Plan de mejora

Cuatro ejes: **rendimiento**, **animaciones**, **jugabilidad** y **ampliación de historia**. Cada fase tiene criterios de aceptación verificables.

## Fase 1 — Estabilizar (✅ hecha)
**Objetivo:** que la historia se pueda jugar de principio a fin y el progreso no se pierda.
- Nodo 5 + Acto II, presets fusionados, guardado/continuar, fallback de assets, NG0600, música.
- **Aceptación:** ✅ `npm run build` sin errores · ✅ `npm run test:ci` 11/11 · ✅ recorrido Playwright hasta un final sin errores de consola · ✅ "Continuar" retoma el nodo guardado.

## Fase 2 — Rendimiento (✅ parcial)
- ✅ Rutas lazy (`layout`, `main`, `arcade`). Inicial: 102.6 → 93.3 KB transferidos.
- ✅ `decoding="async"`, `draggable=false` en capas; `preload: none` en audio; precarga en idle disponible (`CharacterAssetService.preload`).
- ✅ Script `scripts/optimize-assets.mjs` (sharp, local y gratuito) → WebP (opcional AVIF); cambiar `ASSET_EXT`.
- 🧩 Ejecutarlo con los assets reales; objetivo de peso por capa ≤ 60 KB y fondo ≤ 250 KB.
- ⏳ Audio en `.ogg/.m4a` a 96–128 kbps.
- **Aceptación:** Lighthouse móvil Performance ≥ 90; LCP < 2.5 s en 4G simulado; 60 FPS sostenidos en escena; heap < 60 MB.

## Fase 3 — Animaciones y feedback (✅ parcial)
- ✅ Respiración idle del personaje, logo flotante, burbuja con entrada, banner de final, badge de inventario, hover/active en botones, pulso de zonas resaltadas.
- ✅ Todo se desactiva con `prefers-reduced-motion` o el ajuste "Reducir movimiento".
- ⏳ Transición de escena (fundido o "wipe" de graffiti) al cambiar `sceneEffect`/fondo.
- ⏳ Parpadeo de ojos (alternar `eyes` cada 3–6 s) y micro-movimiento de brazos en idle.
- ⏳ "+N CAOS" flotante y SFX.
- **Aceptación:** ninguna animación dura > 400 ms en interacciones; cero animaciones con reduced-motion; sin jank (frames > 50 ms) en el perfil de Chrome.

## Fase 4 — Jugabilidad (✅ parcial)
- ✅ Inventario con objetos que **abren opciones** (`requiresItem`) y ramas (`ITEM_BRANCH`).
- ✅ Flags (`setsFlag`, `requiresFlag`), ramas por caos (`CHAOS_BRANCH`), finales (`ENDING`) y reinicio (`RESTART`).
- ✅ Pistas por nodo, resaltado de zonas, ajustes de texto/volumen, táctil (≥ 44 px, `touch-action`), vibración real en móvil.
- ⏳ Usar objetos desde el inventario sobre zonas del personaje/escena.
- ⏳ Varias ranuras de guardado y exportar/importar partida (JSON).
- **Aceptación:** cada final alcanzable (test de grafo) · todos los controles operables con teclado · ajustes persisten tras recargar.

## Fase 5 — Historia (✅ Acto II · ⏳ siguientes)
- ✅ Acto II "El almacén del químico": 3 entradas (sigilo con tarjeta, distracción con disfraz, Fishbones), bóveda condicionada por objeto y 5 finales: *Smoke and Sirens*, *Shiny Pockets*, *Leverage*, *Fireworks Over Zaun*, *Rooftop Afterglow* (sugerente, fundido a negro).
- ⏳ Actos III+ según `escenas-propuestas.md`.
- **Aceptación:** test de integridad sin nodos rotos ni callejones sin salida; tono y formato del guion existentes; contenido nuevo no gráfico.

## Fase 6 — Producción
- ⏳ CI, PWA, i18n ES/EN, decisión sobre el backend, empaquetado Electron (electron-builder).
