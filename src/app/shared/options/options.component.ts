import { Component, input, output, ChangeDetectionStrategy, HostListener, effect, signal, ElementRef, viewChildren, AfterViewInit } from '@angular/core';
import { DialogueOption } from '@interfaces/dialogue-node.interface';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent implements AfterViewInit {
  options = input<DialogueOption[]>([]);
  optionSelected = output<number>();

  focusedOptionIndex = signal<number>(0);
  optionButtons = viewChildren<ElementRef>('optionButton');

  constructor() {
    effect(() => {
      // Reset focused option when options change
      if (this.options().length > 0) {
        this.focusedOptionIndex.set(0);
        // Ensure focus is set after view initializes and options are rendered
        setTimeout(() => this.focusOption(0), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial focus when component loads with options
    if (this.options().length > 0) {
      this.focusOption(0);
    }
  }

  selectOption(nextNodeId: number): void {
    this.optionSelected.emit(nextNodeId);
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.options().length === 0) return;

    const currentIndex = this.focusedOptionIndex();
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        newIndex = (currentIndex > 0) ? currentIndex - 1 : this.options().length - 1;
        event.preventDefault(); // Prevent page scroll
        break;
      case 'ArrowDown':
        newIndex = (currentIndex < this.options().length - 1) ? currentIndex + 1 : 0;
        event.preventDefault(); // Prevent page scroll
        break;
      case 'Enter':
        this.selectOption(this.options()[currentIndex].nextNodeId);
        event.preventDefault();
        break;
      default:
        return; // Do not prevent default for other keys
    }

    if (newIndex !== currentIndex) {
      this.focusedOptionIndex.set(newIndex);
      this.focusOption(newIndex);
    }
  }

  private focusOption(index: number): void {
    const buttons = this.optionButtons();
    if (buttons && buttons.length > index) {
      buttons[index].nativeElement.focus();
    }
  }
}
