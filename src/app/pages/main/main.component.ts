import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from '@services/game.service';
import { EventService } from '@services/event.service';
import { LoadingService } from '@services/loading.service';
import { GameState } from '@interfaces/game-state.interface';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { CharacterProps } from '@interfaces/character-props.interface';
import { CharacterComponent } from '@shared/character/character.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private eventService = inject(EventService);
  private loadingService = inject(LoadingService);

  gameState!: GameState;
  currentNode!: DialogueNode | undefined;
  characterProps: CharacterProps | undefined;

  // Effects states
  isVibrating = false;
  isFlashing = false;
  isFlashlightMode = false;

  // Flashlight position
  flashlightX = 0;
  flashlightY = 0;

  private gameStateSubscription!: Subscription;
  private eventsSubscription!: Subscription;

  ngOnInit(): void {
    this.loadingService.show();
    this.gameService.loadInitialState();

    // Hide after state is loaded
    this.loadingService.hide();

    this.gameStateSubscription = this.gameService.gameState$.subscribe(state => {
      this.gameState = state;
      this.currentNode = this.gameService.getCurrentNode();

      if (this.currentNode) {
        this.isFlashlightMode = this.currentNode.sceneEffect === 'flashlight';

        if (this.currentNode.character) {
          this.characterProps = this.gameState.characters[this.currentNode.character];
        }
      }
    });

    this.eventsSubscription = this.eventService.events$.subscribe(event => {
      if (event.type === 'VIBRATE') {
        this.triggerVibration();
      } else if (event.type === 'FLASH') {
        this.triggerFlash();
      }
    });
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }

  private triggerVibration(): void {
    this.isVibrating = true;
    setTimeout(() => this.isVibrating = false, 900);
  }

  private triggerFlash(): void {
    this.isFlashing = true;
    setTimeout(() => this.isFlashing = false, 300);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isFlashlightMode) {
      const target = event.currentTarget as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        this.flashlightX = event.clientX - rect.left;
        this.flashlightY = event.clientY - rect.top;
      }
    }
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    // Only handle if we are in flashlight mode or have other mouse movements to track
    if (this.isFlashlightMode) {
      this.onMouseMove(event);
    }
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
