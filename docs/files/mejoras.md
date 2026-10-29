# Mejoras aplicables (priorizadas)

Estado: ✅ implementada en `feat/mejoras-auditoria` · ⏳ pendiente · 🧩 requiere assets/decisión del autor

## P0 — Bloqueantes
| Mejora | Hallazgo | Estado |
|---|---|---|
| Escribir el nodo `5` y el Acto II para que la historia no se corte | J1 | ✅ |
| No borrar la partida al entrar; botones **Continuar / Nueva historia** | J3 | ✅ |
| Fusionar presets en el estado para que el vestuario/expresión se vea | J4 | ✅ |
| Añadir presets faltantes (`smirk`, `curious`, `nervous-happy`, `ecstatic`, `tease`, `lusty`, `naked-top`) | J5 | ✅ (alias provisionales, ajustar a gusto) |
| Puerta de edad 18+ con aviso "todos los personajes son adultos" | 2.5 | ✅ |
| Fallback visual si faltan PNG (silueta + ocultar capa rota, logo de texto) | J2 | ✅ |
| Publicar los assets de `public/` (o un paquete separado/LFS privado) | J2 | 🧩 |

## P1 — Alta
| Mejora | Estado |
|---|---|
| Layout móvil: filas `minmax(0,…)`, `100dvh`, sidebar con scroll, horizontal compacto | ✅ |
| Zonas táctiles en % + `<button>` con `aria-label`, foco visible y resaltado opcional | ✅ |
| `prefers-reduced-motion` + opción "Reducir movimiento y destellos" (desactiva flash/sacudidas) | ✅ |
| Panel de ajustes real: volumen, mute, velocidad de texto, movimiento, resaltar zonas, vibración, reiniciar progreso, finales | ✅ |
| Arreglar ruta de música `/history` → `/game`, reintento de audio en el primer gesto, volumen persistente | ✅ |
| Arreglar `NG0600` del inventario | ✅ |
| Code splitting: layout/juego/arcade cargados bajo demanda (−9 KB transferidos iniciales) | ✅ |
| Convertir PNG → WebP/AVIF (`npm run optimize:assets`, `ASSET_EXT`) | ✅ script · 🧩 ejecutar con los assets |
| Cargar fuentes Bangers/Outfit (`display=swap`) | ✅ |

## P2 — Media
| Mejora | Estado |
|---|---|
| Efecto máquina de escribir (clic completa, segundo clic avanza; Enter/Espacio) | ✅ |
| Pistas por nodo (`hint`) con botón 💡 | ✅ |
| Flags, `requiresItem`, `requiresFlag`, `setsFlag`, `CHAOS_BRANCH`, `ITEM_BRANCH`, `ENDING`, `RESTART` en el formato de datos | ✅ |
| 5 finales con contador persistente | ✅ |
| Inventario coherente con la identidad visual, contador en botón, cierre con Esc | ✅ |
| Meta SEO/OG, `noindex`, `rating=adult`, `theme-color` | ✅ |
| Pruebas Karma: integridad del guion + GameService (11 tests) | ✅ |
| Quitar `backend/dev.db` del repo | ✅ |
| SFX (clic, explosión, objeto obtenido) | ⏳ |
| Animación del medidor de caos (+N flotante) | ⏳ |
| Pantalla de título con ilustración/ key art y logo SVG | 🧩 |
| Precarga del siguiente vestuario (`CharacterAssetService.preload`) conectada al guion | ⏳ (API lista) |

## P3 — Baja
* ⏳ i18n (ES/EN) con archivos de texto por idioma; hoy el juego está en inglés.
* ⏳ PWA (manifest + service worker) para jugar offline.
* ⏳ Conectar o eliminar el backend Prisma (hoy no se usa).
* ⏳ Tipografía del diálogo: sustituir la monoespaciada por Outfit o una fuente de cómic legible.
* ⏳ Opciones en minúscula-normal (no todo MAYÚSCULAS) para lectura.
* ⏳ CI (GitHub Actions) con `npm run build` + `npm run test:ci`.
