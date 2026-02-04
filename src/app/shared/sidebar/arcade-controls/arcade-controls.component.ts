import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CharacterProps } from '@interfaces/character-props.interface';

@Component({
  selector: 'app-arcade-controls',
  imports: [],
  templateUrl: './arcade-controls.component.html',
  styleUrl: './arcade-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArcadeControlsComponent {
  @Input() arcadeProps: CharacterProps | undefined;
  @Input() arcadeChaos: number = 0;

  @Output() chaosChanged = new EventEmitter<number>();
  @Output() presetApplied = new EventEmitter<{ type: string, preset: string }>();
  @Output() propertyToggled = new EventEmitter<{ key: string, value: string }>();
  @Output() effectToggled = new EventEmitter<{ key: string, value: string }>();
  @Output() miniGameStarted = new EventEmitter<void>();
  @Output() menuRequested = new EventEmitter<void>();

  updateChaos(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.chaosChanged.emit(value);
  }

  applyPreset(type: string, preset: string): void {
    this.presetApplied.emit({ type, preset });
  }

  toggle(key: string, value: string): void {
    this.propertyToggled.emit({ key, value });
  }

  toggleEffect(key: string, value: string): void {
    this.effectToggled.emit({ key, value });
  }

  isToggled(key: string, value: string): boolean {
    if (!this.arcadeProps) return false;
    return (this.arcadeProps as any)[key] === value;
  }

  isEffectToggled(key: string, value: string): boolean {
    if (!this.arcadeProps?.effects) return false;
    return (this.arcadeProps.effects as any)[key] === value;
  }

  startMiniGame(): void {
    this.miniGameStarted.emit();
  }

  goToMenu(): void {
    this.menuRequested.emit();
  }
}
