import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _isSettingsPanelOpen = signal<boolean>(false);
  public isSettingsPanelOpen = this._isSettingsPanelOpen.asReadonly();

  constructor() { }

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
