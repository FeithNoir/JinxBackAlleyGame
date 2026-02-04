import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Input, Output, EventEmitter, HostListener, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameService } from '@services/game.service';
import { CharacterService } from '@services/character.service';
import { MiniGameService } from '@services/mini-game.service';
import { MusicService } from '@services/music.service';
import { GameState } from '@interfaces/game-state.interface';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { CharacterProps } from '@interfaces/character-props.interface';
import { ChaosMeterComponent } from './chaos-meter/chaos-meter.component';
import { MusicControlsComponent } from './music-controls/music-controls.component';
import { ChatAreaComponent, ChatMessage } from './chat-area/chat-area.component';
import { ArcadeControlsComponent } from './arcade-controls/arcade-controls.component';

@Component({
  selector: 'app-sidebar',
  imports: [ChaosMeterComponent, MusicControlsComponent, ChatAreaComponent, ArcadeControlsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewChecked {
  private gameService = inject(GameService);
  private characterService = inject(CharacterService);
  private miniGameService = inject(MiniGameService);
  private musicService = inject(MusicService);
  private router = inject(Router);

  @ViewChild('chatArea') private chatArea!: ElementRef;

  @Input() isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  isArcadeMode = false;
  gameState!: GameState;
  currentNode!: DialogueNode | undefined;
  dialogueHistory: ChatMessage[] = [];
  arcadeProps: CharacterProps | undefined;
  arcadeChaos = 0;
  isMobile = false;

  private subs = new Subscription();

  volume = 0.5;
  isMuted = false;
  showVolumeSlider = false;
  isAskingName = false;

  ngOnInit(): void {
    this.checkMobile();

    this.subs.add(
      this.gameService.isAskingName$.subscribe(asking => this.isAskingName = asking)
    );
    this.subs.add(
      this.musicService.volume$.subscribe(v => this.volume = v)
    );
    this.subs.add(
      this.musicService.isMuted$.subscribe(m => this.isMuted = m)
    );

    // Detect route for arcade mode
    this.checkRoute(this.router.url);
    this.subs.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      })
    );

    this.subs.add(
      this.gameService.gameState$.subscribe(state => {
        this.gameState = state;
        const newNode = this.gameService.getCurrentNode();

        if (newNode && newNode !== this.currentNode) {
          this.currentNode = newNode;
          this.addToHistory(newNode.character, newNode.text);
        }
      })
    );

    this.subs.add(
      this.characterService.characterProps$.subscribe(props => {
        this.arcadeProps = props;
      })
    );

    this.subs.add(
      this.characterService.arcadeChaosLevel$.subscribe(level => {
        this.arcadeChaos = level;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private checkRoute(url: string): void {
    this.isArcadeMode = url.includes('/arcade');
  }

  private addToHistory(speaker: string, text: string): void {
    this.dialogueHistory.push({ speaker, text });
  }

  private scrollToBottom(): void {
    if (this.chatArea) {
      try {
        this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  // Arcade Controls Handlers
  onChaosChanged(value: number): void {
    this.characterService.setArcadeChaosLevel(value);
  }

  onPresetApplied(data: { type: string, preset: string }): void {
    this.characterService.applyPreset(data.type as 'outfit' | 'expression', data.preset);
  }

  onPropertyToggled(data: { key: string, value: string }): void {
    this.characterService.toggleLayer(data.key as keyof CharacterProps, data.value);
  }

  onEffectToggled(data: { key: string, value: string }): void {
    this.characterService.updateEffect(data.key as keyof Required<CharacterProps>['effects'], data.value);
  }

  onMiniGameStarted(): void {
    this.miniGameService.start(10);
  }

  // Chat Area Handlers
  onDialogueAdvanced(): void {
    if (this.currentNode?.nextNodeId) {
      this.gameService.selectOption(this.currentNode.nextNodeId);
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
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  onSaveRequested(): void {
    this.gameService.saveGame();
  }

  // Navigation
  goToMenu(): void {
    this.router.navigate(['/']);
  }

}
