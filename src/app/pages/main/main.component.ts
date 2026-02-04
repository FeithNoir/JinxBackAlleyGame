import { Component, OnInit, HostListener, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '@services/game.service';
import { EventService } from '@services/event.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  private gameService = inject(GameService);
  private eventService = inject(EventService);
  private loadingService = inject(LoadingService);

  protected backgroundStyle: string = "url('background/bg-1.png')";

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

  isFlashlightMode = computed(() => this.currentNode()?.sceneEffect === 'flashlight');

  // Effects states (Local Signals)
  isVibrating = signal<boolean>(false);
  isFlashing = signal<boolean>(false);

  // Flashlight position (Local Signals)
  flashlightX = signal<number>(0);
  flashlightY = signal<number>(0);

  constructor() {
    // Handle global events (Vibrate/Flash) via RxJS stream linked to effects
    this.eventService.events$.subscribe(event => {
      if (event.type === 'VIBRATE') {
        this.triggerVibration();
      } else if (event.type === 'FLASH') {
        this.triggerFlash();
      }
    });
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.gameService.loadInitialState();
    this.loadingService.hide();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }

  private triggerVibration(): void {
    this.isVibrating.set(true);
    setTimeout(() => this.isVibrating.set(false), 900);
  }

  private triggerFlash(): void {
    this.isFlashing.set(true);
    setTimeout(() => this.isFlashing.set(false), 300);
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (this.isFlashlightMode()) {
      const target = event.currentTarget as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        this.flashlightX.set(event.clientX - rect.left);
        this.flashlightY.set(event.clientY - rect.top);
      }
    }
  }
}
