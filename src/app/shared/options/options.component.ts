import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { DialogueOption } from '@interfaces/dialogue-node.interface';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
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
