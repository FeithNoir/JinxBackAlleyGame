import { Component, inject, ChangeDetectionStrategy, HostListener, signal, computed, input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@services/event.service';

@Component({
  selector: 'app-screen-effects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screen-effects.component.html',
  styleUrl: './screen-effects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.flashlight-active]': 'sceneEffect() === "flashlight"' // Apply class based on input
  }
})
export class ScreenEffectsComponent {
  protected eventService = inject(EventService);
  private elementRef = inject(ElementRef);

  // Input to control scene effects
  sceneEffect = input<'flashlight' | 'night' | 'none'>('none');

  // Flashlight position (Local Signals)
  flashlightX = signal<number>(0);
  flashlightY = signal<number>(0);

  // Computed style for the dynamic overlay
  overlayStyle = computed(() => {
    const effect = this.sceneEffect();
    if (effect === 'flashlight') {
      return {
        background: `radial-gradient(circle at ${this.flashlightX()}px ${this.flashlightY()}px, transparent 150px, rgba(0,0,0,0.9) 100%)`,
        'pointer-events': 'auto', // Enable pointer events for flashlight
        'z-index': '1000'
      };
    } else if (effect === 'night') {
      return {
        background: 'rgba(0, 0, 0, 0.7)',
        'pointer-events': 'none',
        'z-index': '999'
      };
    }
    return {
      background: 'transparent',
      'pointer-events': 'none',
      'z-index': 'auto'
    };
  });

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (this.sceneEffect() === 'flashlight') {
      const hostElement = this.elementRef.nativeElement;
      const rect = hostElement.getBoundingClientRect();
      this.flashlightX.set(event.clientX - rect.left);
      this.flashlightY.set(event.clientY - rect.top);
    }
  }
}
