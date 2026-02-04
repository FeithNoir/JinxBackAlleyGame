import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game.service';
import { GameState } from '../../core/interfaces/game-state.interface';
import { DialogueNode } from '../../core/interfaces/dialogue-node.interface';
import { Subscription } from 'rxjs';
import { DialoguesComponent } from '../dialogues/dialogues.component';
import { OptionsComponent } from '../options/options.component';

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

  isCollapsed = false;
  gameState!: GameState;
  currentNode!: DialogueNode | undefined;
  dialogueHistory: ChatMessage[] = [];
  private gameStateSubscription!: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameStateSubscription = this.gameService.gameState$.subscribe(state => {
      this.gameState = state;
      const newNode = this.gameService.getCurrentNode();

      if (newNode && newNode !== this.currentNode) {
        this.currentNode = newNode;
        this.addToHistory(newNode.character, newNode.text);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private addToHistory(speaker: string, text: string) {
    // Avoid duplicate entries if the node hasn't actually changed but state did
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

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/150/9333EA/FFD600?text=JINX';
  }
}
