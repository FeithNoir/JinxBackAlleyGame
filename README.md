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
-   `styles.css`: Global stylesheet, now including custom CSS design tokens for the "Purple Chaos" aesthetic.

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

## Support the Project

If you enjoy the chaos, consider supporting the developer on Patreon:
[**Generic Factory International**](https://patreon.com/genericfactoryint?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink)
