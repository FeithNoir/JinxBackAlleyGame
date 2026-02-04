import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CharacterProps } from '@interfaces/character-props.interface';

@Component({
  selector: 'app-arcade-controls',
  standalone: true,
  imports: [],
  templateUrl: './arcade-controls.component.html',
  styleUrl: './arcade-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArcadeControlsComponent {
  arcadeProps = input<CharacterProps | undefined>(undefined);
  arcadeChaos = input<number>(0);

  chaosChanged = output<number>();
  presetApplied = output<{ type: string, preset: string }>();
  propertyToggled = output<{ key: string, value: string }>();
  effectToggled = output<{ key: string, value: string }>();
  miniGameStarted = output<void>();
  menuRequested = output<void>();

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
    const props = this.arcadeProps();
    if (!props) return false;
    return (props as any)[key] === value;
  }

  isEffectToggled(key: string, value: string): boolean {
    const props = this.arcadeProps();
    if (!props?.effects) return false;
    return (props.effects as any)[key] === value;
  }

  startMiniGame(): void {
    this.miniGameStarted.emit();
  }

  goToMenu(): void {
    this.menuRequested.emit();
  }
}
