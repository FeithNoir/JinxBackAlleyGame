# Jinx Backalley Game — Improvement Work Plan

> **Last Updated:** 2026-02-18 | **Angular Version:** 19.2 | **Electron:** 40.x

This document contains the full diagnostic of the current codebase and a prioritized improvement plan covering architecture, performance, gameplay experience, and visual quality.

**Task Legend:**
- ✅ **AI-Solvable** — Can be fully implemented by an AI agent.
- ❌ **Creative Task** — Requires human input (narrative design, art direction, etc.).
- 🔄 **In Progress** — Currently being worked on.
- ✔️ **Done** — Completed.

---

## Part 1 — Current Codebase Diagnostic

### 1.1 Architecture & State Management

| Finding | Location | Severity |
|---|---|---|
| `EventService` uses `RxJS Subject` instead of Signals | `core/services/event.service.ts` | 🔴 High |
| Services expose redundant `toObservable()` wrappers alongside Signals | All services | 🟡 Medium |
| `SidebarComponent` uses `router.events.pipe(filter(...)).subscribe()` instead of `toSignal` | `shared/sidebar/sidebar.component.ts` | 🟡 Medium |
| `MusicService` uses `router.events.pipe(filter(...)).subscribe()` instead of `toSignal` | `core/services/music.service.ts` | 🟡 Medium |
| `MainComponent` subscribes to `eventService.events$` in constructor without cleanup | `pages/main/main.component.ts` | 🔴 High |
| `ArcadeComponent` uses `takeUntil(destroy$)` pattern (legacy) instead of `takeUntilDestroyed()` | `pages/arcade/arcade.component.ts` | 🟡 Medium |
| `MiniGameService.start()` accepts no `MiniGameType` in `SidebarComponent` call | `shared/sidebar/sidebar.component.ts:136` | 🔴 High (Bug) |
| Reaction strings hardcoded inside `GameService.interactWith()` and `MiniGameService` | `core/services/game.service.ts`, `mini-game.service.ts` | 🟡 Medium |
| `GameState.id` is unused (intended for DB but no backend integration exists) | `core/interfaces/game-state.interface.ts` | 🟢 Low |

### 1.2 Component Redundancy & Duplication

| Finding | Location | Severity |
|---|---|---|
| `<app-mini-game>` rendered inside **both** `CharacterComponent` and `ArcadeComponent` | `shared/character/character.component.html:12`, `pages/arcade/arcade.component.html:12` | 🔴 High |
| `backgroundStyle` string duplicated in `MainComponent`, `ArcadeComponent`, and `TitleComponent` | All three page components | 🟡 Medium |
| `@keyframes shake` animation duplicated in `main.component.css` and `character.component.css` | Both CSS files | 🟡 Medium |
| Screen effect logic (`isVibrating`, `isFlashing`, `triggerVibration()`, `triggerFlash()`) only exists in `MainComponent`; `ArcadeComponent` has no screen effects | `pages/main/main.component.ts` | 🔴 High |
| `CommonModule` imported in standalone components that only use `@if`/`@for` (new control flow syntax makes it unnecessary) | Multiple components | 🟡 Medium |

### 1.3 Angular Syntax & Modern API Usage

| Finding | Location | Severity |
|---|---|---|
| `CommonModule` still imported in standalone components using new `@if`/`@for` syntax | Multiple components | 🟡 Medium |
| `ngOnInit` used in `SidebarComponent` with empty body (initialization moved to constructor) | `shared/sidebar/sidebar.component.ts:75` | 🟢 Low |
| `ngAfterViewChecked` used for scroll-to-bottom (runs on every CD cycle, expensive) | `shared/sidebar/sidebar.component.ts:79` | 🟡 Medium |
| `model()` signal used for `isCollapsed` in `SidebarComponent` but `LayoutComponent` uses a local `signal()` — the two-way binding is never used | `pages/layout/layout.component.ts` | 🟢 Low |
| `OnInit` interface implemented but `ngOnInit` is empty in `ArcadeComponent` and `SidebarComponent` | Multiple | 🟢 Low |
| `MusicService.ngOnDestroy()` is not decorated with `@HostListener` or tied to lifecycle — it will never be called in a root-provided service | `core/services/music.service.ts:89` | 🟡 Medium |

### 1.4 Gameplay Experience

| Finding | Location | Severity |
|---|---|---|
| Screen effects (vibrate/flash) are not applied in Arcade mode | `pages/arcade/arcade.component.ts` | 🔴 High |
| Mini-game has only one type (`Clicker`) and no visual variety | `shared/mini-game/` | 🟡 Medium |
| Dialogue options have no visual transition when appearing/disappearing | `shared/dialogues/`, `shared/sidebar/chat-area/` | 🟡 Medium |
| `interactWith()` reaction text is hardcoded in English only | `core/services/game.service.ts` | 🟡 Medium |
| Chaos meter has no visual "milestone" feedback (e.g., pulse at 25/50/75/100) | `shared/sidebar/chaos-meter/` | 🟡 Medium |
| No keyboard navigation support for dialogue options | `shared/sidebar/chat-area/` | 🟡 Medium |
| `LoadingService.hide()` uses a hardcoded 800ms delay with no actual async operation | `core/services/loading.service.ts` | 🟢 Low |

### 1.5 Visual & Graphical Representation

| Finding | Location | Severity |
|---|---|---|
| `character.component.css` uses fixed pixel sizes (`width: 400px`, `height: 640px`) — not responsive | `shared/character/character.component.css` | 🟡 Medium |
| No CSS transitions on character layer changes (outfit/expression swaps are instant) | `shared/character/character.component.css` | 🟡 Medium |
| Flashlight effect radius is hardcoded (`150px`) with no dynamic scaling | `pages/main/main.component.html:16` | 🟢 Low |
| Screen flash animation is only white — no color variants for different event types | `pages/main/main.component.css` | 🟢 Low |
| No entrance/exit animation for the `<app-character>` when switching scenes | Multiple | 🟡 Medium |
| Speech bubble is positioned with a fixed negative top offset (`top: -80px`) that clips on small screens | `shared/character/character.component.css:21` | 🟡 Medium |

### 1.6 Modularization & Centralization

| Finding | Location | Severity |
|---|---|---|
| Screen effects (flash, vibrate, flashlight) are implemented ad-hoc in `MainComponent` — no reusable module | `pages/main/main.component.ts` | 🔴 High |
| No centralized `EffectsModule` or `ScreenEffectsComponent` that can be reused across pages | Entire project | 🔴 High |
| `DIALOGUE_DATA` is imported directly in `GameService` — no abstraction layer for data access | `core/services/game.service.ts:4` | 🟡 Medium |
| Interaction reaction map is a plain `Record` inside `GameService.interactWith()` — should be externalized to a data file | `core/services/game.service.ts:200` | 🟡 Medium |

---

## Part 2 — Improvement Plan

### Priority Matrix

| Priority | Category | Task | AI-Solvable | Status |
|---|---|---|---|---|
| 🔴 P1 | Architecture | Migrate `EventService` from RxJS Subject to Signals | ✅ Yes | ✔️ Done |
| 🔴 P1 | Architecture | Fix `MainComponent` event subscription leak (no cleanup) | ✅ Yes | ✔️ Done |
| 🔴 P1 | Modularization | Create `ScreenEffectsComponent` — centralize flash/vibrate/flashlight | ✅ Yes | ✔️ Done |
| 🔴 P1 | Component Redundancy | Remove `<app-mini-game>` from `CharacterComponent` (keep only in `ArcadeComponent`/overlay) | ✅ Yes | ✔️ Done |
| 🔴 P1 | Bug Fix | Fix `MiniGameService.start()` call in `SidebarComponent` (missing `MiniGameType` argument) | ✅ Yes | ✔️ Done |
| 🔴 P1 | Bug Fix | `DialoguesComponent` receives an empty `text` input | ✅ Yes | ✔️ Done |
| 🔴 P1 | Bug Fix | `MainComponent` event subscription has no cleanup (memory leak) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Architecture | Remove `toObservable()` wrappers from all services (use Signals directly in templates) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Architecture | Replace `router.events.subscribe()` with `toSignal(router.events.pipe(...))` in `SidebarComponent` and `MusicService` | ✅ Yes | ✔️ Done | | ✅ Yes | ✔️ Done |
| 🟡 P2 | Architecture | Replace `takeUntil(destroy$)` with `takeUntilDestroyed()` in `ArcadeComponent` | ✅ Yes | ✔️ Done |
| 🟡 P2 | Angular Syntax | Remove `CommonModule` from standalone components using new control flow (`@if`, `@for`) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Angular Syntax | Remove empty `ngOnInit` implementations and unused `OnInit` interface | ✅ Yes | ✔️ Done |
| 🟡 P2 | Modularization | Externalize `backgroundStyle` to a shared token or `SceneService` | ✅ Yes | ✔️ Done |
| 🟡 P2 | Modularization | Externalize reaction strings from `GameService` and `MiniGameService` to a data file | ✅ Yes | ✔️ Done |
| 🟡 P2 | CSS | Deduplicate `@keyframes shake` — move to `styles.css` global stylesheet | ✅ Yes | ✔️ Done |
| 🟡 P2 | Gameplay | Apply screen effects (vibrate/flash) in Arcade mode | ✅ Yes | ✔️ Done |
| 🟡 P2 | Gameplay | Add CSS transitions to character layer changes (outfit/expression swaps) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Gameplay | Add entrance/exit animations for `<app-character>` on scene transitions | ✅ Yes | ✔️ Done |
| 🟡 P2 | Gameplay | Add keyboard navigation for dialogue options (arrow keys + Enter) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Visual | Make `CharacterComponent` responsive (replace fixed px with `clamp()` / `vmin` units) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Visual | Fix speech bubble clipping on small screens (use dynamic positioning) | ✅ Yes | ✔️ Done |
| 🟡 P2 | Visual | Add visual milestone feedback to Chaos Meter (pulse at 25/50/75/100) | ✅ Yes | ✔️ Done |
| 🟢 P3 | Architecture | Fix `MusicService.ngOnDestroy()` — it will never fire in a root service | ✅ Yes | ✔️ Done |
| 🟢 P3 | Gameplay | Add color variants to screen flash (e.g., red for danger, white for shock) | ✅ Yes | Pending |
| 🟢 P3 | Gameplay | Make flashlight radius dynamic (scale with viewport size) | ✅ Yes | Pending |
| 🟢 P3 | Architecture | Simplify `model()` → `input()` for `SidebarComponent.isCollapsed` (two-way binding unused) | ✅ Yes | Pending |
| 🟢 P3 | Architecture | Remove `GameState.id` or connect it to a real persistence layer | ✅ Yes | Pending |
| 🟢 P3 | Modularization | Abstract `DIALOGUE_DATA` access behind a `DialogueRepository` service | ✅ Yes | Pending |
| 🟢 P3 | Performance | Replace `ngAfterViewChecked` scroll logic with `effect()` | ✅ Yes | ✔️ Done |
| — | Narrative | Deeper narrative branching and player choice consequences | ❌ Creative | Pending |
| — | Narrative | Dynamic dialogue content with contextual variables | ❌ Creative | Pending |
| — | Narrative | Tutorial / onboarding flow | ❌ Creative | Pending |
| — | Narrative | Repetitive dialogue flow (`nextNodeId: 5` loop) — requires new script content | ❌ Creative | Pending |

---

## Part 3 — Detailed Task Breakdown

### 3.1 Create `ScreenEffectsComponent` (P1 — Modularization)

**Goal:** Centralize all screen-level visual effects (flash, vibrate, flashlight) into a single reusable component that can be dropped into any page.

**Current Problem:**
- `isVibrating`, `isFlashing`, `triggerVibration()`, `triggerFlash()` only exist in `MainComponent`.
- `ArcadeComponent` has zero screen effects.
- The `EventService` uses a `Subject` which requires manual subscriptions and cleanup.

**Proposed Solution:**
1. Migrate `EventService` to use Signals: replace `Subject<{type, payload}>` with individual `signal<boolean>` for each effect type.
2. Create `src/app/shared/screen-effects/screen-effects.component.ts` that:
   - Injects `EventService` and reads its signals directly.
   - Renders the flash overlay, shake class, and flashlight overlay.
   - Handles `@HostListener('mousemove')` for the flashlight internally.
   - Exposes an `@Input sceneEffect` to enable/disable the flashlight mode.
3. Replace the inline effect markup in `main.component.html` with `<app-screen-effects [sceneEffect]="currentNode()?.sceneEffect">`.
4. Add `<app-screen-effects>` to `arcade.component.html` as well.

### 3.2 Migrate `EventService` to Signals (P1 — Architecture)

**Goal:** Replace the `RxJS Subject` with Angular Signals to align with the project's reactive model.

**Proposed Solution:**
```typescript
// Before
private eventsSubject = new Subject<{ type: GameEventType; payload?: any }>();
public events$ = this.eventsSubject.asObservable();

// After
private _isVibrating = signal<boolean>(false);
private _isFlashing = signal<boolean>(false);
public isVibrating = this._isVibrating.asReadonly();
public isFlashing = this._isFlashing.asReadonly();

public vibrate(duration = 200): void {
  this._isVibrating.set(true);
  setTimeout(() => this._isVibrating.set(false), duration);
}

public flash(): void {
  this._isFlashing.set(true);
  setTimeout(() => this._isFlashing.set(false), 300);
}
```
This eliminates the subscription in `MainComponent`'s constructor and the associated memory leak.

### 3.3 Remove `CommonModule` from Standalone Components (P2 — Angular Syntax)

**Goal:** Angular 17+ new control flow (`@if`, `@for`, `@switch`) does not require `CommonModule`. Removing it reduces bundle size and clarifies intent.

**Affected components:**
- `MainComponent`, `ArcadeComponent`, `TitleComponent`, `DialoguesComponent`, `OptionsComponent`, `SettingsComponent`, `MiniGameComponent`, `CharacterComponent`

### 3.4 Fix `MiniGameComponent` Duplication (P1 — Component Redundancy)

**Current Problem:** `<app-mini-game>` is rendered inside `character.component.html` (line 12) AND inside `arcade.component.html` (line 12). This means two instances of the mini-game overlay are rendered simultaneously in Arcade mode.

**Proposed Solution:**
- Remove `<app-mini-game>` from `character.component.html`.
- Remove `MiniGameComponent` from `CharacterComponent`'s imports array.
- Keep `<app-mini-game>` only in `arcade.component.html` and add it to `main.component.html` (triggered by the same `miniGameService.isActive()` signal).

### 3.5 Make `CharacterComponent` Responsive (P2 — Visual)

**Current Problem:** Fixed `width: 400px; height: 640px` breaks on small screens.

**Proposed Solution:** Use `clamp()` and `aspect-ratio`:
```css
.character-composite-container {
  position: relative;
  width: clamp(200px, 40vmin, 400px);
  aspect-ratio: 400 / 640;
}
```

### 3.6 Add CSS Transitions to Character Layers (P2 — Visual)

**Goal:** Smooth outfit and expression changes instead of instant swaps.

**Proposed Solution:** Add `transition: opacity 0.2s ease` to the `.layer` class in `character.component.css`. Use `@if` with Angular animations or CSS `@starting-style` (Chrome 117+) for enter/leave transitions.

### 3.7 Deduplicate `@keyframes shake` (P2 — CSS)

**Current Problem:** The `shake` keyframe animation is defined identically in both `main.component.css` and `character.component.css`.

**Proposed Solution:** Move the definition to `src/styles.css` (global stylesheet) and remove it from both component stylesheets.

### 3.8 Externalize Reaction Strings (P2 — Modularization)

**Goal:** Move hardcoded reaction text from `GameService.interactWith()` and `MiniGameService.updateReaction()` to a dedicated data file (e.g., `core/data/reactions.ts`), enabling future i18n support.

### 3.9 Replace `ngAfterViewChecked` Scroll Logic (P2 — Performance)

**Current Problem:** `ngAfterViewChecked` in `SidebarComponent` runs on every change detection cycle, calling `scrollToBottom()` each time.

**Proposed Solution:** Use an `effect()` that watches `dialogueHistory` signal and scrolls only when the history actually changes:
```typescript
effect(() => {
  const _ = this.dialogueHistory(); // track dependency
  // Use afterNextRender or queueMicrotask to scroll after DOM update
  queueMicrotask(() => this.scrollToBottom());
});
```

### 3.10 Add Chaos Meter Milestone Feedback (P2 — Gameplay)

**Goal:** Provide visual feedback when chaos reaches key thresholds (25, 50, 75, 100).

**Proposed Solution:** In `ChaosMeterComponent`, use a `computed()` signal to derive the current tier and apply a CSS class that triggers a pulse animation. Emit an `output()` event so the parent can trigger a screen flash.

---

## Part 4 — Previously Completed Work

| Category | Task | Status |
|---|---|---|
| User Interface (UI) | Neo-Brutalist Design Consistency | ✔️ Done |
| User Interface (UI) | Visual Feedback for Interactions | ✔️ Done |
| Game Flow | Mini-game Integration (`ArcadeComponent`) | ✔️ Done |
| User Experience (UX) | Game Settings Panel | ✔️ Done |
| User Interface (UI) | Responsiveness and Adaptability (initial pass) | ✔️ Done |
| User Experience (UX) | Save/Load (basic persistence via `StorageService`) | ✔️ Done |
| Build Fix | Resolved TypeScript `TS7053` error by adding index signatures to `InteractionReactions` interface | ✔️ Done |

---

## Part 5 — Confirmed Bug Catalog

> These are **active bugs** identified through static code analysis. Each entry includes the exact file and line, a description of the problem, and its observable impact on the game.

---

### 🐛 BUG-01 — `MiniGameService.start()` called without required `MiniGameType` argument
**Severity:** 🔴 Critical — Mini-game cannot start correctly from the sidebar  
**File:** `src/app/shared/sidebar/sidebar.component.ts` — line 136  
**Status:** ✔️ Done

### 🐛 BUG-02 — `DialoguesComponent` receives an empty `text` input
**Severity:** 🔴 Critical — The dialogue component is effectively unused in history mode  
**File:** `src/app/shared/sidebar/chat-area/chat-area.component.html` — line 40  
**Status:** ✔️ Done

### 🐛 BUG-03 — `MainComponent` event subscription has no cleanup (memory leak)
**Severity:** 🔴 Critical — Subscription accumulates on every navigation  
**File:** `src/app/pages/main/main.component.ts` — lines 49–55  
**Status:** ✔️ Done

---

### 🐛 BUG-04 — `SidebarComponent` router subscription has no cleanup
**Severity:** 🟡 Medium — Memory leak on long sessions  
**File:** `src/app/shared/sidebar/sidebar.component.ts` — lines 68–72  
**Status:** ✔️ Done

---

### 🐛 BUG-05 — `MusicService` router subscription has no cleanup
**Severity:** 🟡 Medium — Subscription reference is lost; impossible to unsubscribe  
**File:** `src/app/core/services/music.service.ts` — lines 42–46  
**Status:** ✔️ Done

---

### 🐛 BUG-06 — `MusicService.ngOnDestroy()` is never called
**Severity:** 🟡 Medium — Audio resources are never released  
**File:** `src/app/core/services/music.service.ts` — lines 89–92  
**Status:** ✔️ Done

---

### 🐛 BUG-07 — `SettingsComponent` is an empty placeholder
**Severity:** 🟡 Medium — Settings button opens a non-functional panel  
**File:** `src/app/shared/settings/settings.component.html`  
**Reproduction:** Click the "Settings" button in the sidebar.

**Impact:** The panel opens but contains no controls. Users cannot change volume, text speed, language, or any other preference. `SettingsService` only tracks panel open/close state — no settings are persisted.

---

### 🐛 BUG-08 — Screen effects (vibrate/flash) absent in Arcade mode
**Severity:** 🟡 Medium — Inconsistent gameplay feedback  
**File:** `src/app/pages/arcade/arcade.component.ts`  
**Status:** ✔️ Done

---

### 🐛 BUG-09 — `<app-mini-game>` rendered twice simultaneously in Arcade mode
**Severity:** 🟡 Medium — Duplicate UI overlay; double-speed mini-game progress  
**Files:** `src/app/shared/character/character.component.html:12`, `src/app/pages/arcade/arcade.component.html:12`  
**Status:** ✔️ Done

---

### 🐛 BUG-10 — `ngAfterViewChecked` scroll fires on every change detection cycle
**Severity:** 🟢 Low — Performance degradation on long dialogue sessions  
**File:** `src/app/shared/sidebar/sidebar.component.ts` — lines 79–81  
**Status:** ✔️ Done

---

## Part 6 — Design Guide & Code Patterns

> This section establishes the **official standards** for all new and refactored code in the project. All contributions should follow these patterns to ensure consistency, maintainability, and alignment with Angular 17+ best practices.

---

### 6.1 Design System — Visual Tokens

All visual properties **must** use the CSS custom properties defined in `src/styles.css`. Never use raw hex values or hardcoded sizes in component stylesheets.

#### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--c-primary` | `#9333EA` | Jinx Purple — headings, primary buttons, accents |
| `--c-accent` | `#FFD600` | Warning Yellow — highlights, chaos meter, labels |
| `--c-action` | `#00BFFF` | Electric Blue — interactive elements, links |
| `--c-action-dark` | `#008CBA` | Darker Blue — hover states for action elements |
| `--c-dark` | `#111827` | Ink Black — backgrounds, borders |
| `--c-light` | `#FAF5FF` | Lavender White — body text, light surfaces |

#### Typography

| Token | Font | Usage |
|---|---|---|
| `--font-comic` | `'Bangers'` (display) | All headings (`h1`–`h6`), labels, UI titles |
| `--font-ui` | `'Outfit'` (sans-serif) | Body text, dialogue text, inputs |

> **Rule:** Never use `font-family` directly in component CSS. Always reference `var(--font-comic)` or `var(--font-ui)`.

#### Borders & Shadows (Neo-Brutalist Tokens)

| Token | Value | Usage |
|---|---|---|
| `--border-thick` | `3px solid #000000` | Standard component borders |
| `--shadow-hard` | `6px 6px 0px 0px #000000` | Default Neo-Brutalist drop shadow |
| `--shadow-hard-hover` | `9px 9px 0px 0px #000000` | Hover state shadow (larger offset) |
| `--shadow-hard-active` | `2px 2px 0px 0px #000000` | Active/pressed state shadow (smaller offset) |

#### Standard Button Pattern

```css
.neo-btn {
  border: var(--border-thick);
  box-shadow: var(--shadow-hard);
  font-family: var(--font-comic);
  background: var(--c-primary);
  color: var(--c-light);
  transition: box-shadow 0.1s ease, transform 0.1s ease;
}
.neo-btn:hover {
  box-shadow: var(--shadow-hard-hover);
  transform: translate(-2px, -2px);
}
.neo-btn:active {
  box-shadow: var(--shadow-hard-active);
  transform: translate(3px, 3px);
}
```

---

### 6.2 Angular Component Patterns

#### ✅ Standalone Component Template

Every new component **must** be standalone. Use this as the base template:

```typescript
import { Component, input, output, computed, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [], // ← Do NOT import CommonModule; use @if/@for directly
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // ← Always use OnPush
})
export class MyComponent {
  // 1. Injected services (use inject(), never constructor params)
  private myService = inject(MyService);

  // 2. Signal inputs (use input() / input.required())
  myProp = input.required<string>();
  optionalProp = input<number>(0);

  // 3. Outputs (use output())
  myEvent = output<string>();

  // 4. Computed signals (derived state)
  derivedValue = computed(() => this.myProp().toUpperCase());
}
```

#### ✅ Template Control Flow

Always use the new Angular 17+ block syntax. **Never use `*ngIf` or `*ngFor`.**

```html
<!-- ✅ Correct -->
@if (isVisible()) { <div>Content</div> }

@for (item of items(); track item.id) { <div>{{ item.name }}</div> }

@switch (status()) {
  @case ('active') { <span>Active</span> }
  @default         { <span>Unknown</span> }
}

<!-- ❌ Incorrect -->
<div *ngIf="isVisible()">Content</div>
<div *ngFor="let item of items()">{{ item.name }}</div>
```

#### ✅ Two-Way Binding

Use `model()` **only** when a parent genuinely needs two-way binding. For read-only data flow, use `input()` + `output()`.

```typescript
// ✅ True two-way binding (e.g., collapsible panels, form controls)
isCollapsed = model<boolean>(false);

// ✅ One-directional data + event
value = input<number>(0);
valueChange = output<number>();
```

---

### 6.3 Signal Conventions

#### Service Signal Pattern

All services must expose state as **read-only signals**. Observable wrappers (`toObservable()`) should only be added when a specific RxJS operator is needed (e.g., `debounceTime`, `distinctUntilChanged`).

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // ✅ Private writable signal
  private _myState = signal<MyType>(initialValue);

  // ✅ Public read-only signal (components consume this)
  public myState = this._myState.asReadonly();

  // ⚠️ Only add this if you need RxJS operators downstream
  // public myState$ = toObservable(this._myState);

  public updateState(value: MyType): void {
    this._myState.set(value);
  }
}
```

#### Subscription Cleanup

When RxJS subscriptions are unavoidable, always use `takeUntilDestroyed()`:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  constructor() {
    someObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => { ... });
  }
}
```

> **Rule:** Never use `Subject<void>` + `takeUntil(destroy$)` + `ngOnDestroy()`. This pattern is superseded by `takeUntilDestroyed()` in Angular 16+.

---

### 6.4 Service Responsibilities

Each service has a single, well-defined responsibility. Do not add logic that belongs to another service.

| Service | Responsibility | Do NOT add |
|---|---|---|
| `GameService` | Dialogue flow, game state, chaos level, player flags | Audio, character rendering |
| `CharacterService` | Character props, expressions, outfit presets, reactions | Game state, dialogue logic |
| `MiniGameService` | Mini-game lifecycle (start/progress/end), timer | Character reactions (delegate to `CharacterService`) |
| `MusicService` | Audio playback, volume, mute, track switching | Game state, routing logic |
| `EventService` | Screen-level event signals (vibrate, flash) | Business logic, state |
| `StorageService` | Serialization, localStorage/Electron IPC | Game logic, validation |
| `LoadingService` | Loading overlay visibility signal | Content loading logic |
| `SettingsService` | Settings panel visibility, user preferences | Game state |

---

### 6.5 File & Folder Naming Conventions

```
src/app/
├── core/                        # Singleton services, interfaces, data
│   ├── data/                    # Static game data (dialogues, reactions, presets)
│   ├── interfaces/              # TypeScript interfaces and enums
│   └── services/                # Injectable services
├── pages/                       # Route-level components (one per route)
│   ├── title/                   # /title route
│   ├── layout/                  # /game layout shell
│   ├── main/                    # /game (history mode)
│   └── arcade/                  # /game/arcade
└── shared/                      # Reusable components (no route awareness)
    ├── character/               # Character composite renderer
    ├── dialogues/               # Dialogue text display
    ├── footer/                  # Layout footer
    ├── header/                  # Layout header
    ├── loading/                 # Loading overlay
    ├── mini-game/               # Mini-game overlay
    ├── options/                 # Dialogue option buttons
    ├── screen-effects/          # [PROPOSED] Centralized screen effects
    ├── settings/                # Settings panel
    └── sidebar/                 # Sidebar shell + sub-components
        ├── arcade-controls/
        ├── chaos-meter/
        ├── chat-area/
        └── music-controls/
```

**Naming rules:**
- Components: `kebab-case` folders, `PascalCase` class names, `app-` selector prefix.
- Services: `camelCase` filename, `PascalCase` class, `Service` suffix.
- Interfaces: `PascalCase`, no `I` prefix (e.g., `DialogueNode`, not `IDialogueNode`).
- Enums: `PascalCase` (e.g., `MiniGameType`).
- Data files: `camelCase` (e.g., `dialogues.ts`, `reactions.ts`).

---

### 6.6 Character Layer Rendering Order

The `CharacterComponent` renders layers in a strict z-index order. When adding new layers, always follow this stack:

| Z-Index | Layer Class | Asset Path | Description |
|---|---|---|---|
| 1 | `.base` | `character/base/body.png` | Base body (always visible) |
| 2 | `.underwear-bottom` | `character/clothes/{id}.png` | Underwear bottom |
| 3 | `.stockings` | `character/clothes/{id}.png` | Stockings |
| 4 | `.underwear-top` | `character/clothes/{id}.png` | Underwear top |
| 5 | `.clothes-bottom` | `character/clothes/{id}.png` | Outer bottom clothing |
| 6 | `.effect-bottom` | `character/effects/{id}.png` | Effect on bottom area |
| 7 | `.clothes-top` | `character/clothes/{id}.png` | Outer top clothing |
| 8 | `.feet` | `character/clothes/{id}.png` | Footwear |
| 9 | `.effect-feet` | `character/effects/{id}.png` | Effect on feet |
| 10 | `.arm-left` / `.arm-right` | `character/arms/{dir}/{id}.png` | Arm gestures |
| 11 | `.head-accessory` | `character/clothes/{id}.png` | Head accessories |
| 12 | `.eyes` / `.mouth` | `character/expressions/{type}/{id}.png` | Facial expressions |
| 13 | `.effect-head` | `character/effects/{id}.png` | Head effects (blush, heat) |
| 14 | `.effect-body` | `character/effects/{id}.png` | Body fluid effects |
| 15 | `.toy` | `character/clothes/{id}.png` | Held toy/prop |
| 100 | `.effect-overlay` | `character/effects/{id}.png` | Full-body overlay (biri-biri, action-lines) |

> **Rule:** The `effects` object in `CharacterProps` maps to specific layer slots. Never use the `overlay` slot for anything other than full-body overlays.

---

### 6.7 Dialogue Node Authoring Guide

When adding new dialogue nodes to `core/data/dialogues.ts`, follow this structure:

```typescript
{
  id: 200,                        // Unique integer ID (never reuse). Story nodes start at 100.
  character: 'jinx',              // Must match a key in GameState.characters
  text: 'Hello, {playerName}!',   // Use {playerName} placeholder for dynamic name
  characterProps: {               // Optional: override character appearance for this node
    eyes: 'e-2',
    effects: { overlay: 'action-lines' }
  },
  presets: [                      // Optional: apply named presets before rendering
    { type: 'expression', id: 'happy' }
  ],
  sceneEffect: 'flashlight',      // Optional: 'flashlight' | 'none'
  chaosChange: 5,                 // Optional: chaos delta applied when this node is reached
  nextNodeId: 201,                // For linear flow (no options)
  options: [                      // For branching (mutually exclusive with nextNodeId)
    {
      text: 'Option A',
      nextNodeId: 202,
      chaosChange: 10,
      chaosRequirement: 50        // Only shown if chaosLevel >= 50
    }
  ],
  metadata: {
    type: 'NAME_REQUEST'          // Triggers the player name input UI
  }
}
```

> **ID Ranges:** 1–99 reserved for system use. Story nodes: 100+. Interaction nodes (from `interactWith()`): 900+.

---

### 6.8 Adding New Screen Effects

When adding a new screen effect (after `ScreenEffectsComponent` is created per task 3.1):

1. **Add a signal to `EventService`:**
   ```typescript
   private _isNewEffect = signal<boolean>(false);
   public isNewEffect = this._isNewEffect.asReadonly();
   public triggerNewEffect(duration = 500): void {
     this._isNewEffect.set(true);
     setTimeout(() => this._isNewEffect.set(false), duration);
   }
   ```

2. **Add the CSS animation to `src/styles.css`** (global, not component-scoped):
   ```css
   @keyframes new-effect-anim { ... }
   .new-effect { animation: new-effect-anim 0.5s ease-out forwards; }
   ```

3. **Add the overlay to `screen-effects.component.html`:**
   ```html
   @if (eventService.isNewEffect()) {
     <div class="new-effect"></div>
   }
   ```

4. **Trigger from a service** (`GameService` or `CharacterService`) as needed.

> **Rule:** Screen effects are purely visual. They must never modify game state or trigger business logic.
