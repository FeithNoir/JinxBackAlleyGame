import { Injectable, signal, effect } from '@angular/core';

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';

export interface GameSettings {
  textSpeed: TextSpeed;
  reducedMotion: boolean;
  highlightHotspots: boolean;
  vibration: boolean;
}

const KEY = 'jinx.settings';
const DEFAULTS: GameSettings = {
  textSpeed: 'normal',
  reducedMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  highlightHotspots: false,
  vibration: true,
};

/** Milisegundos por carácter del efecto máquina de escribir. */
export const TEXT_SPEED_MS: Record<TextSpeed, number> = { slow: 45, normal: 25, fast: 10, instant: 0 };

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _isSettingsPanelOpen = signal<boolean>(false);
  public isSettingsPanelOpen = this._isSettingsPanelOpen.asReadonly();

  private _settings = signal<GameSettings>(this.read());
  public settings = this._settings.asReadonly();

  constructor() {
    effect(() => {
      const s = this._settings();
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* modo privado */ }
      document.documentElement.classList.toggle('reduced-motion', s.reducedMotion);
      document.documentElement.classList.toggle('show-hotspots', s.highlightHotspots);
    });
  }

  private read(): GameSettings {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  }

  update(patch: Partial<GameSettings>): void {
    this._settings.update(s => ({ ...s, ...patch }));
  }

  toggleSettingsPanel(): void {
    this._isSettingsPanelOpen.update(value => !value);
  }

  openSettingsPanel(): void {
    this._isSettingsPanelOpen.set(true);
  }

  closeSettingsPanel(): void {
    this._isSettingsPanelOpen.set(false);
  }
}
