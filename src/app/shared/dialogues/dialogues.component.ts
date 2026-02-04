import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialogues.component.html',
  styleUrl: './dialogues.component.css'
})
export class DialoguesComponent {
  @Input() speaker: string = '';
  @Input() text: string = '';
  @Output() dialogueAdvance = new EventEmitter<void>();

  advanceDialogue(): void {
    this.dialogueAdvance.emit();
  }
}
