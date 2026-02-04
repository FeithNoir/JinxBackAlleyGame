import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogueOption } from '@interfaces/dialogue-node.interface';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent {
  options = input<DialogueOption[]>([]);
  optionSelected = output<number>();

  selectOption(nextNodeId: number): void {
    this.optionSelected.emit(nextNodeId);
  }
}
