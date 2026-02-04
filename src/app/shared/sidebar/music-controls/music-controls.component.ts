import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-music-controls',
  imports: [],
  templateUrl: './music-controls.component.html',
  styleUrl: './music-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicControlsComponent {
  @Input() volume: number = 0.5;
  @Input() isMuted: boolean = false;
  @Input() showVolumeSlider: boolean = false;
  @Input() isMobile: boolean = false;

  @Output() volumeChanged = new EventEmitter<number>();
  @Output() muteToggled = new EventEmitter<void>();
  @Output() sliderToggled = new EventEmitter<void>();
  @Output() saveRequested = new EventEmitter<void>();

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
