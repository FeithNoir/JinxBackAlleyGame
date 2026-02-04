import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game.service';
import { EventService } from '../../core/services/event.service';
import { GameState } from '../../core/interfaces/game-state.interface';
import { DialogueNode } from '../../core/interfaces/dialogue-node.interface';
import { Subscription } from 'rxjs';
import { CharacterProps } from '../../core/interfaces/character-props.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {
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

  constructor(
    private gameService: GameService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.gameService.loadInitialState();

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
