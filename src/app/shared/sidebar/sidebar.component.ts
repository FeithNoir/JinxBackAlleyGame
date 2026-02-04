import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game.service';
import { CharacterService } from '../../core/services/character.service';
import { GameState } from '../../core/interfaces/game-state.interface';
import { DialogueNode } from '../../core/interfaces/dialogue-node.interface';
import { CharacterProps } from '../../core/interfaces/character-props.interface';
import { Subscription } from 'rxjs';
import { DialoguesComponent } from '../dialogues/dialogues.component';
import { OptionsComponent } from '../options/options.component';
import { MiniGameService } from '../../core/services/mini-game.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface ChatMessage {
  speaker: string;
  text: string;
  isPlayer?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, DialoguesComponent, OptionsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatArea') private chatArea!: ElementRef;

  @Input() isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  isArcadeMode = false;
  gameState!: GameState;
  currentNode!: DialogueNode | undefined;
  dialogueHistory: ChatMessage[] = [];
  arcadeProps: CharacterProps | undefined;
  arcadeChaos = 0;

  private subs = new Subscription();

  constructor(
    private gameService: GameService,
    private characterService: CharacterService,
    private miniGameService: MiniGameService,
    private router: Router
  ) { }

  ngOnInit(): void {
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

  isToggled(prop: keyof CharacterProps, value: string): boolean {
    return this.arcadeProps ? this.arcadeProps[prop] === value : false;
  }

  isEffectToggled(key: keyof Required<CharacterProps>['effects'], value: string): boolean {
    return this.arcadeProps?.effects?.[key] === value;
  }
}
