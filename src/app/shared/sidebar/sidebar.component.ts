import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { DialoguesComponent } from '@shared/dialogues/dialogues.component';
import { OptionsComponent } from '@shared/options/options.component';

export interface ChatMessage {
  speaker: string;
  text: string;
  isPlayer?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, DialoguesComponent, OptionsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
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
  tempPlayerName = '';

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
    this.characterService.setMode(this.isArcadeMode ? 'arcade' : 'history');
  }

  private addToHistory(speaker: string, text: string) {
    const lastMsg = this.dialogueHistory[this.dialogueHistory.length - 1];
    if (lastMsg && lastMsg.speaker === speaker && lastMsg.text === text) return;
    this.dialogueHistory.push({ speaker, text });
  }

  private scrollToBottom(): void {
    try {
      this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
    } catch (err) { }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  onOptionSelected(nextNodeId: number): void {
    const selectedOption = this.currentNode?.options?.find(opt => opt.nextNodeId === nextNodeId);
    if (selectedOption) {
      this.dialogueHistory.push({ speaker: 'PLAYER', text: selectedOption.text, isPlayer: true });
    }
    this.gameService.selectOption(nextNodeId);
  }

  onDialogueAdvance(): void {
    if (this.currentNode && this.currentNode.nextNodeId) {
      this.gameService.selectOption(this.currentNode.nextNodeId);
    }
  }

  // Arcade Controls
  toggle(prop: keyof CharacterProps, value: string): void {
    this.characterService.toggleLayer(prop, value);
  }

  toggleEffect(key: keyof Required<CharacterProps>['effects'], value: string): void {
    this.characterService.updateEffect(key, value);
  }

  applyPreset(type: 'outfit' | 'expression', id: string): void {
    this.characterService.applyPreset(type, id);
  }

  updateChaos(event: any): void {
    this.characterService.setArcadeChaosLevel(parseInt(event.target.value));
  }

  startMiniGame(): void {
    this.miniGameService.start(10);
  }

  onSave(): void {
    this.gameService.saveGame();
    // Maybe show a quick visual feedback in the future
  }

  goToMenu(): void {
    this.router.navigate(['/']);
  }

  toggleMute(): void {
    this.musicService.toggleMute();
  }

  onVolumeChange(event: any): void {
    this.musicService.setVolume(parseFloat(event.target.value));
  }

  toggleVolumeSlider(): void {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  submitPlayerName(): void {
    if (this.tempPlayerName.trim()) {
      this.gameService.setPlayerName(this.tempPlayerName.trim());
    }
  }

  isToggled(prop: keyof CharacterProps, value: string): boolean {
    return this.arcadeProps ? this.arcadeProps[prop] === value : false;
  }

  isEffectToggled(key: keyof Required<CharacterProps>['effects'], value: string): boolean {
    return this.arcadeProps?.effects?.[key] === value;
  }
}
