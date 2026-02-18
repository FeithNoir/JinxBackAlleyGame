import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@services/game.service';
import { EventService } from '@services/event.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';
import { MiniGameComponent } from '@shared/mini-game/mini-game.component';
import { MiniGameService } from '@services/mini-game.service';
import { ScreenEffectsComponent } from '@shared/screen-effects/screen-effects.component';
import { SceneService } from '@services/scene.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CharacterComponent, MiniGameComponent, ScreenEffectsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  private gameService = inject(GameService);
  protected eventService = inject(EventService);
  private loadingService = inject(LoadingService);
  protected miniGameService = inject(MiniGameService);
  protected sceneService = inject(SceneService);

  

  // Core signals from service
  gameState = this.gameService.gameState;

  // Derived state
  currentNode = computed(() => this.gameService.getCurrentNode());

  characterProps = computed(() => {
    const node = this.currentNode();
    if (node?.character) {
      return this.gameState().characters[node.character];
    }
    return undefined;
  });

  ngOnInit(): void {
    this.loadingService.show();
    this.gameService.loadInitialState();
    this.loadingService.hide();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }
}
