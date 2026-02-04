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
