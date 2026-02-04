import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogueOption } from '@interfaces/dialogue-node.interface';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  @Input() options: DialogueOption[] = [];
  @Output() optionSelected = new EventEmitter<number>();

  selectOption(nextNodeId: number): void {
    this.optionSelected.emit(nextNodeId);
  }
}
