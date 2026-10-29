import { Component, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { SettingsService, TextSpeed } from '@services/settings.service';
import { MusicService } from '@services/music.service';
import { GameService } from '@services/game.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'settings-title' }
})
export class SettingsComponent {
  protected settingsService = inject(SettingsService);
  protected music = inject(MusicService);
  protected game = inject(GameService);
  protected settings = this.settingsService.settings;
  protected speeds: TextSpeed[] = ['slow', 'normal', 'fast', 'instant'];
  protected confirmReset = false;

  @HostListener('document:keydown.escape')
  closeSettings(): void {
    this.settingsService.closeSettingsPanel();
  }

  onVolume(e: Event): void {
    this.music.setVolume(+(e.target as HTMLInputElement).value);
  }

  setSpeed(s: TextSpeed): void { this.settingsService.update({ textSpeed: s }); }
  toggle(key: 'reducedMotion' | 'highlightHotspots' | 'vibration'): void {
    this.settingsService.update({ [key]: !this.settings()[key] });
  }

  resetProgress(): void {
    if (!this.confirmReset) { this.confirmReset = true; return; }
    this.game.newGame();
    this.confirmReset = false;
    this.closeSettings();
  }
}
