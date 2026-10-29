import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SceneService } from '@services/scene.service';
import { GameService } from '@services/game.service';
import { SettingsService } from '@services/settings.service';

const AGE_KEY = 'jinx.ageConfirmed';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {
  private router = inject(Router);
  protected sceneService = inject(SceneService);
  protected game = inject(GameService);
  protected settings = inject(SettingsService);

  protected ageConfirmed = signal<boolean>(this.readAge());

  private readAge(): boolean {
    try { return localStorage.getItem(AGE_KEY) === '1'; } catch { return false; }
  }

  confirmAge(): void {
    try { localStorage.setItem(AGE_KEY, '1'); } catch { /* modo privado */ }
    this.ageConfirmed.set(true);
  }

  leave(): void {
    window.location.href = 'https://www.google.com';
  }

  async continueGame(): Promise<void> {
    await this.game.continueGame();
    this.router.navigate(['/game']);
  }

  startGame(): void {
    this.game.newGame();
    this.router.navigate(['/game']);
  }

  startArcade(): void {
    this.router.navigate(['/game/arcade']);
  }
}
