import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, FormsModule, DialoguesComponent, OptionsComponent],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAreaComponent {
  dialogueHistory = input<ChatMessage[]>([]);
  currentNode = input<DialogueNode | undefined>(undefined);
  isAskingName = input<boolean>(false);
  isMobile = input<boolean>(false);

  dialogueAdvanced = output<void>();
  optionSelected = output<number>();
  playerNameSubmitted = output<string>();
  menuRequested = output<void>();
  settingsToggled = output<void>();

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
