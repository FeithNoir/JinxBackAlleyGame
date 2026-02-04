import { Component, OnInit, viewChild, ElementRef, AfterViewChecked, input, output, model, HostListener, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GameService } from '@services/game.service';
import { CharacterService } from '@services/character.service';
import { MiniGameService } from '@services/mini-game.service';
import { MusicService } from '@services/music.service';
import { ChaosMeterComponent } from './chaos-meter/chaos-meter.component';
import { MusicControlsComponent } from './music-controls/music-controls.component';
import { ChatAreaComponent, ChatMessage } from './chat-area/chat-area.component';
import { ArcadeControlsComponent } from './arcade-controls/arcade-controls.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [ChaosMeterComponent, MusicControlsComponent, ChatAreaComponent, ArcadeControlsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, AfterViewChecked {
  private gameService = inject(GameService);
  private characterService = inject(CharacterService);
  private miniGameService = inject(MiniGameService);
  private musicService = inject(MusicService);
  private router = inject(Router);

  // View Queries
  chatAreaComp = viewChild<ChatAreaComponent>('chatAreaComp');
  chatAreaEl = viewChild<ElementRef>('chatArea');

  // Inputs/Outputs
  isCollapsed = model<boolean>(false);

  // State Signals (Linking to service signals)
  isArcadeMode = signal<boolean>(false);
  isMobile = signal<boolean>(false);
  showVolumeSlider = signal<boolean>(false);

  // Dialogue History (Local state, but could be globalized later)
  dialogueHistory = signal<ChatMessage[]>([]);

  // Computed / Readonly Signals from Services
  gameState = this.gameService.gameState;
  isAskingName = this.gameService.isAskingName;
  arcadeProps = this.characterService.characterProps;
  arcadeChaos = this.characterService.arcadeChaosLevel;
  volume = this.musicService.volume;
  isMuted = this.musicService.isMuted;

  currentNode = computed(() => this.gameService.getCurrentNode());

  constructor() {
    this.checkMobile();
    this.checkRoute(this.router.url);

    // Track dialogue history
    effect(() => {
      const node = this.currentNode();
      if (node) {
        this.addToHistory(node.character, node.text);
      }
    });

    // Handle navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  ngOnInit(): void {
    // Initialization logic handled by constructor/signals
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth <= 768);
  }

  private checkRoute(url: string): void {
    this.isArcadeMode.set(url.includes('/arcade'));
  }

  private addToHistory(speaker: string, text: string): void {
    const history = this.dialogueHistory();
    // Avoid duplicates if effect triggers multiple times for same node
    const lastMsg = history[history.length - 1];
    if (lastMsg?.speaker === speaker && lastMsg?.text === text) return;

    this.dialogueHistory.update(h => [...h, { speaker, text }]);
  }

  private scrollToBottom(): void {
    const el = this.chatAreaEl();
    if (el) {
      try {
        el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  toggleSidebar(): void {
    this.isCollapsed.update((v: boolean) => !v);
  }

  // Arcade Controls Handlers
  onChaosChanged(value: number): void {
    this.characterService.setArcadeChaosLevel(value);
  }

  onPresetApplied(data: { type: string, preset: string }): void {
    this.characterService.applyPreset(data.type as any, data.preset);
  }

  onPropertyToggled(data: { key: string, value: string }): void {
    this.characterService.toggleLayer(data.key as any, data.value);
  }

  onEffectToggled(data: { key: string, value: string }): void {
    this.characterService.updateEffect(data.key as any, data.value);
  }

  onMiniGameStarted(): void {
    this.miniGameService.start(10);
  }

  // Chat Area Handlers
  onDialogueAdvanced(): void {
    const node = this.currentNode();
    if (node?.nextNodeId) {
      this.gameService.selectOption(node.nextNodeId);
    }
  }

  onOptionSelected(nextNodeId: number): void {
    this.gameService.selectOption(nextNodeId);
  }

  onPlayerNameSubmitted(name: string): void {
    this.gameService.setPlayerName(name);
  }

  // Music Controls Handlers
  onVolumeChanged(value: number): void {
    this.musicService.setVolume(value);
  }

  onMuteToggled(): void {
    this.musicService.toggleMute();
  }

  onSliderToggled(): void {
    this.showVolumeSlider.update(v => !v);
  }

  onSaveRequested(): void {
    this.gameService.saveGame();
  }

  // Navigation
  goToMenu(): void {
    this.router.navigate(['/']);
  }
}
