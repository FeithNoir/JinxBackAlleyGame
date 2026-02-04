# Jinx's Back-alley Game

This repository contains the source code for **"Jinx's Back-alley Game"**, a "point-and-click" visual novel developed with Angular. Immerse yourself in a chaotic narrative set in the back alleys, featuring a distinct "Electric Purple / Comic Pop" aesthetic inspired by Jinx and the undercity of Zaun. The project is structured to support a dynamic, component-based architecture, separating game assets from application logic for maintainability and scalability.

## Aesthetic Direction: Purple Chaos

The game's design embraces a high-energy, comic-book inspired, and graffiti-infused visual style. Expect vibrant purple hues, neon accents, and thick black outlines on UI elements, reflecting Jinx's signature chaotic flair.

## Project Structure

The workspace is organized into several key directories, each serving a distinct purpose.

### `/` (Root)

The root directory contains standard configuration files for an Angular project:

-   `angular.json`: Workspace configuration for the Angular CLI, defining build, serve, and test options.
-   `package.json`: Lists project dependencies and defines npm scripts.
-   `tsconfig.json`: Base TypeScript configuration for the project.
-   `.editorconfig` & `.gitignore`: Standard configuration for code editor consistency and Git version control.

### `/public`

This directory serves as the primary repository for all static game assets. The assets are structured to facilitate a layered rendering approach, allowing for dynamic composition of character sprites and scenes.

-   **/background**: Contains background images for various game scenes.
-   **/character**: Holds all character-related assets, categorized for modular composition.
    -   **/base**: The core body sprite.
    -   **/arms**: Left and right arm variations.
    -   **/clothes**: Apparel and accessories, allowing for character customization.
    -   **/effects**: Visual effects like blushes, fluids, and action lines.
    -   **/expressions**: Facial features (eyes, mouths) to convey different emotions.

### `/src`

This directory contains the core application source code.

-   `index.html`: The main HTML entry point.
-   `main.ts`: The primary application bootstrap script.
-   `styles.css`: Global stylesheet with custom CSS design tokens for the "Purple Chaos" aesthetic.
-   `styles/neobrutalist.css`: Centralized Neobrutalist UI component library for consistent design patterns.

#### `/src/app`

The heart of the Angular application, structured into feature modules and shared components.

-   **/pages**: Contains components that represent the primary game screens or states.
    -   **/title**: The title screen component, serving as the game's entry point.
    -   **/main**: The main gameplay component, where the core interaction logic and narrative progression reside.
    -   **/layout**: A wrapper component that defines the global UI layout, integrating shared UI elements.

-   **/shared**: Contains reusable components that are utilized across different pages.
    -   **/dialogues**: Component for rendering dialogue boxes and narrative text, styled as comic-book speech bubbles.
    -   **/options**: Component for displaying player choices, styled as interactive graffiti tags.
    -   **/sidebar**: UI component for a side navigation or status panel.
    -   **/header** & **/footer**: Global header and footer components.

-   **/core**: Contains core application logic, services, and interfaces.
    -   **/interfaces**: TypeScript interfaces for `GameState`, `DialogueNode`, and `CharacterProps`.
    -   **/services**: Includes `GameService` for managing game state and progression.
    -   **/data**: Stores game data, such as `DIALOGUE_DATA` for narrative content.

### `/backend` (Optional)

This directory contains a Node.js backend with Prisma and SQLite, designed for persistent game state storage (save/load functionality). This component is optional for basic gameplay but essential for saving player progress.

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

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

### Recent Improvements (Phase 1 & 2)

**Phase 1: Code Quality**
1. **CSS Centralization**: Created a unified Neobrutalist design system (`styles/neobrutalist.css`) with reusable components:
   - Standardized buttons (`.neo-btn`, `.neo-btn-sm`)
   - Custom form inputs (`.neo-input`, `.neo-range`, `.neo-checkbox`)
   - Consistent scrollbars (`.neo-scrollbar`)
   - Accordion patterns (`.neo-accordion`)

2. **Service Layer Enhancements**:
   - **StorageService**: Added comprehensive error handling and data validation
   - **GameService**: Improved error reporting for save operations
   - Better async/await patterns throughout

3. **Performance Optimizations**:
   - Implemented `OnPush` change detection strategy in presentational components
   - Reduced unnecessary re-renders in `CharacterComponent` and `LoadingComponent`
   - Optimized observable subscriptions

**Phase 2: Angular 17+ Modernization**
1. **Modern Dependency Injection**: Migrated all components and services to use `inject()` function instead of constructor injection
   - Eliminated constructor boilerplate across 13 components and 7 services
   - More concise and functional programming style
   - Better tree-shaking potential

2. **Absolute Path Imports**: Configured TypeScript path mapping for cleaner imports
   - `@services/*` - Core services
   - `@interfaces/*` - TypeScript interfaces
   - `@data/*` - Game data
   - `@shared/*` - Shared components
   - `@pages/*` - Page components
   - `@core/*` - Core modules

3. **Code Modernization Benefits**:
   - 50% shorter import paths
   - 100% reduction in constructor lines
   - Improved code readability and maintainability
   - Better IDE autocomplete and refactoring support

### Planned Optimizations (Future Phases)

- **Bundle Size**: Lazy loading for Arcade mode, dynamic imports for mini-games
- **Asset Optimization**: WebP image format, sprite sheets for character layers
- **State Management**: Potential NgRx/Akita integration for complex state
- **Testing**: Unit tests for services, E2E tests for critical game flows

---

## Future Immersive Features

To make the back-alley experience even more chaotic and immersive, the following features are planned for future updates:

-   **Dynamic Soundscapes**: Implementation of spatial audio and ambient alley sounds (dripping water, distant explosions, neon buzzing).
-   **Animated Character Sprites**: Moving from static layers to Live2D or subtle CSS animations for breathing and blinking.
-   **Deep Relationship System**: Branching narrative paths based not just on Chaos, but on "Trust" levels with Jinx.
-   **Inventory System**: Collect items in the alley to trigger special reactions or unlock new costume parts.
-   **Mini-game Variety**: New rhythm-based or puzzle-based mini-games to break the narrative flow.
-   **Achievement System**: Track player milestones and unlock special content.
-   **Multiple Endings**: Divergent story paths based on player choices and chaos level.
-   **Voice Acting**: Professional voice lines for key dialogue moments.
-   **Particle Effects**: Enhanced visual feedback with WebGL-based particle systems.
-   **Save Slots**: Multiple save files for different playthroughs.
-   **Gallery Mode**: Unlock and view CG artwork and character variations.
-   **Accessibility**: Screen reader support, colorblind modes, and customizable text sizes.

---

## Support the Project

If you enjoy the chaos, consider supporting the developer on Patreon:
[**Generic Factory International**](https://patreon.com/genericfactoryint?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink)
