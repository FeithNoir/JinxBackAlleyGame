import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { DialoguesComponent } from '@shared/dialogues/dialogues.component';
import { OptionsComponent } from '@shared/options/options.component';

export interface ChatMessage {
  speaker: string;
  text: string;
  isPlayer?: boolean;
}

@Component({
  selector: 'app-chat-area',
  imports: [CommonModule, FormsModule, DialoguesComponent, OptionsComponent],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAreaComponent {
  @Input() dialogueHistory: ChatMessage[] = [];
  @Input() currentNode: DialogueNode | undefined;
  @Input() isAskingName: boolean = false;
  @Input() isMobile: boolean = false;

  @Output() dialogueAdvanced = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<number>();
  @Output() playerNameSubmitted = new EventEmitter<string>();
  @Output() menuRequested = new EventEmitter<void>();
  @Output() settingsToggled = new EventEmitter<void>();

  tempPlayerName = '';

  onDialogueAdvance(): void {
    this.dialogueAdvanced.emit();
  }

  onOptionSelected(nextNodeId: number): void {
    this.optionSelected.emit(nextNodeId);
  }

  submitPlayerName(): void {
    if (this.tempPlayerName.trim()) {
      this.playerNameSubmitted.emit(this.tempPlayerName);
      this.tempPlayerName = '';
    }
  }

  goToMenu(): void {
    this.menuRequested.emit();
  }

  toggleSettings(): void {
    this.settingsToggled.emit();
  }
}
