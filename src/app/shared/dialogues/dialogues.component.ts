import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialogues.component.html',
  styleUrl: './dialogues.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'z-index: 2002; position: relative;' // Ensure it's above screen effects
  }
})
export class DialoguesComponent {
  speaker = input<string>('');
  text = input<string>('');
  dialogueAdvance = output<void>();

  advanceDialogue(): void {
    this.dialogueAdvance.emit();
  }
}
