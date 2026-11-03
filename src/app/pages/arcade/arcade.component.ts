import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CharacterService } from '@services/character.service';
import { GameService } from '@services/game.service';
import { EventService } from '@services/event.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';
import { MiniGameService } from '@services/mini-game.service';
import { MiniGameComponent } from '@shared/mini-game/mini-game.component';
import { ScreenEffectsComponent } from '@shared/screen-effects/screen-effects.component';
import { SceneService } from '@services/scene.service';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CharacterComponent, MiniGameComponent, ScreenEffectsComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArcadeComponent implements OnInit {
  private characterService = inject(CharacterService);
  private gameService = inject(GameService);
  protected eventService = inject(EventService);
  private loadingService = inject(LoadingService);
  protected miniGameService = inject(MiniGameService);
  protected sceneService = inject(SceneService);
  protected settings = inject(SettingsService);

  

  // Use service signal directly
  characterProps = this.characterService.characterProps;

  // Derived state
  currentNode = computed(() => this.gameService.getCurrentNode());

  ngOnInit(): void {
    this.loadingService.show();
    this.characterService.setMode('arcade');
    this.loadingService.hide();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }

  // ngOnInit(): void {
  //   // Initialization logic
  // }
}

