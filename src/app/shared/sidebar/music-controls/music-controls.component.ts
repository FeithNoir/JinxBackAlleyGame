import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-music-controls',
  imports: [],
  templateUrl: './music-controls.component.html',
  styleUrl: './music-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicControlsComponent {
  volume = input<number>(0.5);
  isMuted = input<boolean>(false);
  showVolumeSlider = input<boolean>(false);
  isMobile = input<boolean>(false);

  volumeChanged = output<number>();
  muteToggled = output<void>();
  sliderToggled = output<void>();
  saveRequested = output<void>();

  onVolumeChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.volumeChanged.emit(value);
  }

  toggleMute(): void {
    this.muteToggled.emit();
  }

  toggleSlider(): void {
    this.sliderToggled.emit();
  }

  onSave(): void {
    this.saveRequested.emit();
  }
}
