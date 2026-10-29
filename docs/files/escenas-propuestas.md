# Escenas propuestas

Todas usan el formato actual de `src/app/core/data/dialogues.ts` (nodos con `id`, `options`, `metadata`) y las nuevas mecánicas: `requiresItem`, `requiresFlag`/`setsFlag`, `CHAOS_BRANCH`, `ITEM_BRANCH`, `ENDING`. Rango de IDs sugerido entre paréntesis.
**Etiqueta de contenido** (solo como marca, sin texto explícito): `SFW` · `Sugerente` · `Adulto (18+)`.

---

## 1. El taller de Jinx (400–449)
- **Ubicación:** guarida bajo un puente, mesas llenas de cohetes, grafitis luminosos.
- **Objetivo:** reparar a *Fishbones* después del Acto II.
- **Puzles/objetos:** encontrar `hex-crystal` (en una caja con candado de 3 símbolos dibujados en la pared) y `spring-coil` (dentro de un peluche de mono).
- **Personajes:** Jinx.
- **Beats:** Jinx enseña sus juguetes → frustración porque algo falla → el jugador ayuda o la distrae → prueba de disparo.
- **Ramas:** con ambos objetos → Fishbones mejorado (flag `fishbones-mk2`); sin ellos → Jinx improvisa y explota el banco de trabajo (+caos).
- **Arte/assets:** fondo `bg-workshop`, prop `fishbones` (capa opcional en mano), SFX de soldador.
- **Conexión:** sigue a cualquier final del Acto II menos *Smoke and Sirens*.
- **Etiqueta:** SFW.

## 2. Mercado nocturno de Zaun (450–499)
- **Ubicación:** puestos de neón, vapor, vendedores de chatarra.
- **Objetivo:** vender o usar `chem-ledger`.
- **Puzles/objetos:** regateo (opciones que suben/bajan caos), cambiar `chem-ledger` por `disguise-coat` o por información.
- **Personajes:** Jinx, *Madame Rust* (comerciante adulta, irónica), un informante.
- **Beats:** Jinx se aburre → pelea por un peluche → el jugador decide el trato.
- **Ramas:** `ITEM_BRANCH` por el libro; `CHAOS_BRANCH` ≥ 60 → Jinx roba en vez de pagar (persecución).
- **Arte:** fondo `bg-market`, retrato de Madame Rust (capas simples), iconos de 2 objetos.
- **Conexión:** final *Leverage*.
- **Etiqueta:** SFW.

## 3. Persecución en los tejados (500–549)
- **Ubicación:** azoteas con antenas y letreros.
- **Objetivo:** escapar de los matones del barón.
- **Puzles:** secuencia de 3 decisiones con tiempo (mini-juego `Clicker` reutilizado como "sprint"); usar `disguise-coat` para esconderse.
- **Personajes:** Jinx, 2 matones.
- **Ramas:** éxito → flag `escaped-clean`; fallo → captura (lleva a la escena 4).
- **Arte:** fondo `bg-rooftops` con capa de parallax, efecto `action-lines`.
- **Conexión:** después de *Fireworks Over Zaun* o del Mercado con caos alto.
- **Etiqueta:** SFW.

## 4. El despacho del barón (550–599)
- **Ubicación:** oficina elegante sobre la fábrica, vidrieras verdes.
- **Objetivo:** salir del interrogatorio.
- **Puzles:** elegir mentiras coherentes con lo hecho antes (flags: `guards-distracted`, `alarm`); usar `shimmer-keycard` para abrir la salida.
- **Personajes:** el barón químico (adulto, amenazante), Jinx atada a una silla (tono cómico).
- **Ramas:** 3 salidas: diplomática (requiere ledger), explosiva (caos ≥ 70), traición (el jugador entrega a Jinx → final malo *Cold Turkey*).
- **Arte:** fondo `bg-office`, retrato del barón, efecto de luz parpadeante.
- **Etiqueta:** Sugerente (tensión), sin violencia gráfica.

## 5. Noche de karaoke en el bar "The Last Drop" (600–649)
- **Ubicación:** bar de mala muerte con escenario.
- **Objetivo:** ganar un concurso para conseguir pases a una fiesta.
- **Puzles:** elegir canción y coreografía (mini-juego de ritmo sencillo o secuencia de opciones).
- **Personajes:** Jinx, camarero adulto, público.
- **Ramas:** según el caos, actuación tierna, caótica o "demasiado atrevida" (corte de cámara).
- **Arte:** fondo `bg-bar`, outfit nuevo `stage` (capas top/bottom), SFX de público.
- **Etiqueta:** Sugerente.

## 6. Cita en el tejado (650–699) — continuación de *Rooftop Afterglow*
- **Ubicación:** azotea con vista a Piltover.
- **Objetivo:** escena de relación entre adultos; conversación sobre el pasado de Jinx.
- **Beats:** humor → vulnerabilidad → decisión del jugador (quedarse / irse) → **fundido a negro** si se queda.
- **Ramas:** flag `trusted` desbloquea diálogos especiales en futuras escenas.
- **Arte:** fondo `bg-rooftop-night`, efecto `blush`, iluminación cálida.
- **Etiqueta:** Adulto (18+) — escena implícita, sin texto gráfico en el guion.

## 7. Modo Arcade: retos de vestuario (700–749)
- **Ubicación:** el vestidor del modo Arcade.
- **Objetivo:** cumplir 5 retos ("look para infiltrarse", "look de fiesta"…), cada uno desbloquea una prenda.
- **Arte:** iconos de prenda, insignias.
- **Conexión:** las prendas desbloqueadas aparecen como opciones en la historia (`requiresFlag`).
- **Etiqueta:** según la prenda (el sistema ya separa capas).

---

### Tabla de dependencias
| Escena | Requiere | Desbloquea |
|---|---|---|
| Taller | Final ≠ Smoke and Sirens | `fishbones-mk2` |
| Mercado | `chem-ledger` | `disguise-coat` |
| Tejados | caos ≥ 60 o Fireworks | `escaped-clean` |
| Despacho | captura | final *Cold Turkey* |
| Karaoke | — | outfit `stage` |
| Cita | Rooftop Afterglow | `trusted` |

### Necesidades de arte (resumen)
6 fondos nuevos, 2 personajes secundarios con 3 expresiones cada uno, 2 outfits, ~8 iconos de inventario (WebP 128×128), 6 SFX.
