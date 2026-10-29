# Jinx's Back-Alley Game

Novela visual **point-and-click para adultos (18+)** hecha con **Angular 19**. Conversa con Jinx en los callejones de Zaun: tus decisiones suben o bajan el **caos**, desbloquean opciones, objetos y **5 finales**. Incluye un **modo Arcade** (vestidor/sandbox) y empaquetado opcional con **Electron**.

> Todos los personajes son adultos. El juego muestra una puerta de edad al iniciar.

## Requisitos y ejecución

```bash
npm install
npm start              # servidor de desarrollo → http://localhost:4200
npm run build          # build de producción → dist/jinx-backalley-game/browser
npm run test:ci        # pruebas (Karma + Chrome headless; define CHROME_BIN si hace falta)
npm run electron:serve # build + app de escritorio
npm run optimize:assets  # PNG → WebP (requiere: npm i -D sharp)
```

**Assets:** la carpeta `public/` (fondos, capas del personaje, música, iconos, `logo.svg`) **no está versionada** (`.gitignore: public/*`). Sin ella el juego funciona con una silueta y logo de texto de respaldo. Estructura esperada:

```
public/
  background/bg-1.png
  character/{base,arms/left,arms/right,clothes,effects,expressions/eyes,expressions/mouths}/*.png
  icons/{cat-outfit,shimmer-keycard,chem-ledger}.png
  music/{title,main,arcade}.mp3
  logo.svg
```

## Estructura

```
src/app/
  pages/      title (puerta de edad, Continuar/Nueva), layout, main, arcade   ← layout/main/arcade se cargan bajo demanda
  shared/     dialogues (máquina de escribir), options, sidebar (chat, caos, música),
              character (capas + zonas interactivas), inventory, settings, mini-game, header, footer…
  core/
    data/       dialogues.ts (guion), inventory-items.data.ts, reactions.ts
    services/   game (estado, ramas, finales), character, settings (ajustes persistentes), music, storage…
    interfaces/
backend/      API opcional Express + Prisma + SQLite (no conectada al frontend)
scripts/      optimize-assets.mjs
docs/
  files/        documentación del proyecto
  screenshots/  capturas before-* / after-*
```

## Formato del guion (`dialogues.ts`)

Cada nodo: `id`, `character`, `text` (admite `{playerName}`), `presets`, `characterProps`, `chaosChange`, `nextNodeId` u `options`, `hint`, `metadata`.

| Campo | Uso |
|---|---|
| `options[].chaosRequirement` | Opción visible con caos ≥ N |
| `options[].requiresItem` / `requiresFlag` / `setsFlag` | Opciones condicionadas por inventario/flags |
| `metadata.type = 'INVENTORY_ADD'` + `item` | Añade un objeto |
| `'SET_FLAG'` + `flag` | Activa un flag |
| `'CHAOS_BRANCH'` + `branches:[{minChaos,nodeId}]` | Ramifica por caos (de mayor a menor) |
| `'ITEM_BRANCH'` + `item` + 2 `branches` | [tiene, no tiene] |
| `'ENDING'` + `ending` | Final (se guarda en "Endings found") |
| `'RESTART'` | Nueva partida conservando el nombre |

`npm run test:ci` valida que no haya nodos rotos, presets u objetos inexistentes.

## Documentación

- [Auditoría](docs/files/auditoria.md) — hallazgos con severidad y evidencias
- [Mejoras aplicables](docs/files/mejoras.md) — priorizadas, con estado
- [Plan de mejora](docs/files/plan-mejora.md) — fases y criterios de aceptación
- [Escenas propuestas](docs/files/escenas-propuestas.md) — ideas para ampliar la historia
- [Capturas](docs/screenshots/) — `before-*` (estado original) y `after-*` (con mejoras)

## Ajustes del jugador

Volumen/mute, velocidad del texto, reducir movimiento y destellos (también respeta `prefers-reduced-motion`), resaltar zonas interactivas, vibración, reiniciar progreso. Se guardan en `localStorage` (o en `userData/game_data.json` con Electron).

---

## Referencia original (inglés)

## Game Systems & Mechanics

### 1. Game Event System
The game features a centralized `EventService` that triggers dynamic visual effects during dialogues:
-   **Vibration**: The character sprite shakes during intense or chaotic moments (e.g., explosions, "biri-biri" effect).
-   **Scene Flash**: A screen-wide white flash for impactful actions.
-   **Flashlight Effect**: Used in the intro, a dark mask follows the cursor, revealing only a small area of the scene.

### 2. "Click and Point" Interaction
Players can interact directly with the character by clicking on different body parts (Head, Top, Bottom):
-   **Mood-Based Reactions**: Reacting to clicks is driven by the internal **Chaos Level**.
    -   **Low Chaos**: Jinx reacts with annoyance or anger.
    -   **Medium Chaos**: She becomes nervous or shy.
    -   **High Chaos**: She reacts with excitement or joy.

### 3. Gameplay Modes

#### History Mode
Follow the narrative and make choices that influence the **Chaos Meter**. These points unlock special dialogue options and alternate outfits (like the "Cat" outfit). Progression is dialogue-driven with persistent state.

#### Arcade Mode (Dressing Room)
A sandbox mode where players can interact directly with the character without narrative constraints.
-   **Sidebar Integration**: Controls are now conveniently located in the Sidebar for a seamless experience.
-   **Expanded Customization**: Toggle garments, toys (`toy-1`), and multiple fluid/overlay effects.
-   **Chaos Control**: Adjust the **Chaos Level** manually via a slider to see different interactions and moods in real-time.
-   **Instant Feedback**: The character and reactions update instantly as you tweak the settings.

### 4. Music & Audio System
The game includes a dedicated `MusicService` that manages background tracks (`title.mp3`, `main.mp3`, `arcade.mp3`):
-   **Contextual Audio**: Automatically switches tracks based on whether the player is in the Title screen, History Mode, or Arcade Mode.
-   **Volumen Control**: A neobrutalist volume slider and mute toggle are available in the sidebar settings.

### 5. Desktop Application (Electron)
The project can be bundled as a standalone desktop application using Electron:
-   **Environment Awareness**: The game detects if it's running in a browser or as a desktop app.
-   **Local "Backend" Persistence**: In Electron mode, game data is saved directly to a local JSON file (`game_data.json`) instead of `localStorage`, ensuring robust persistence for the desktop experience.

## Build & Deployment

### Production Build (Web)
Run `ng build` to generate the production artifacts. The files will be located in the `dist/jinx-backalley-game/browser` directory.
```bash
npm run build
```

### Desktop Version (Electron)
To build and run the game as a desktop application:
1. Ensure the project is built: `npm run build`
2. Run Electron: `npm run electron:run`
Or do both at once:
```bash
npm run electron:serve
```

## Technical Optimizations

### Recent Improvements (Phase 1, 2 & 3)

**Phase 1 & 2: Structural Foundation**
1.  **CSS Centralization**: Developed a unified Neobrutalist design system (`styles/neobrutalist.css`) with standardized UI components (buttons, inputs, scrollbars).
2.  **Modern Dependency Injection**: Migrated all logic to use the `inject()` function, removing constructor boilerplate.
3.  **Clean Imports**: Implemented absolute path mapping (`@services/*`, `@shared/*`, etc.) for better maintainability.

**Phase 3: State Modernization (Alpha 0.1.0 Ready)**
1.  **Signal Integration**: Refactored `GameService` and `EventService` to use **Angular Signals**. This provides fine-grained reactivity, reduced re-renders, and a cleaner API for state management.
2.  **Inventory System Implementation**: Moved from a planned feature to a functional system. Players can now collect items that persist in the game state.
3.  **Chaos Logic & Branching**: Implemented dynamic narrative branching based on the Chaos Meter. The game now resolves different dialogue paths and outfit offers based on player choices.
4.  **UI Responsiveness**: Enhanced the layout for mobile devices, ensuring the "Purple Chaos" aesthetic remains functional on all screen sizes.
5.  **Event System 2.0**: Centralized visual effects (vibration, flashes, screen shake) driven by Signals for consistent feedback across all game modes.

### Roadmap to Modern Excellence (Angular 20+ & Polish)

To achieve a "state-of-the-art" experience, the following technical and design points are prioritized:

**1. Performance & Architecture**
-   **Zoneless Transition**: Adopt `provideExperimentalZonelessChangeDetection()` to remove the overhead of `Zone.js`, paving the way for the most efficient Angular execution model.
-   **Signal-Based Components**: Complete the migration to `input()`, `output()`, and `viewChild()` APIs. This aligns the codebase with Angular's future direction and improves type safety.
-   **Asset Preloading Service**: Implement a robust preloading strategy for character layers to eliminate visual flickering during state changes.

**2. Visual & Immersive Polishing**
-   **Micro-Animations**: Add subtle breathing and blinking animations to Jinx using CSS keyframes or `@angular/animations` to increase immersion.
-   **State Transitions**: Implement smooth page transitions and loading states that reflect the chaotic graffiti aesthetic.
-   **Interactive Feedback**: Enhance clickable areas with better hover states and dynamic cursors.

**3. UX & Functional Depth**
-   **Save/Load Manager**: A dedicated in-game UI to manage multiple save slots and persistent progress.
-   **Arcade UX Refinement**: Optimize the sidebar controls for mobile users, making customization faster and more intuitive.
-   **Advanced Mini-games**: Expand the variety of interactions beyond simple clicking to include rhythm or logic-based challenges.

### Planned Optimizations (Future Phases)

- **Bundle Size**: Lazy loading for Arcade mode, dynamic imports for mini-games
- **Asset Optimization**: WebP image format, sprite sheets for character layers
- **State Management**: Potential NgRx/Akita integration for complex state
- **Testing**: Unit tests for services, E2E tests for critical game flows

---

## Technical Status

**Current Version**: `0.0.1-alpha.1`  
**Angular Version**: `19.2.0` (Ready for 20+)  
**Stage**: Alpha (Experimental)

---

## Support the Project

If you enjoy the chaos, consider supporting the developer on Patreon:
[**Generic Factory International**](https://patreon.com/genericfactoryint?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink)
