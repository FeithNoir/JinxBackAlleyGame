import { Component, inject, ChangeDetectionStrategy, HostListener, signal, computed, input, ElementRef } from '@angular/core';
import { EventService } from '@services/event.service';

@Component({
  selector: 'app-screen-effects',
  standalone: true,
  imports: [],
  templateUrl: './screen-effects.component.html',
  styleUrl: './screen-effects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.flashlight-active]': 'sceneEffect() === "flashlight"',
    '[class.vibrate]': 'eventService.isVibrating()' // Apply vibrate class to host
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

  // Dynamic flashlight radius
  private dynamicFlashlightRadius = computed(() => {
    // Calculate radius based on viewport size, e.g., 15% of the smaller dimension
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    return Math.max(100, viewportMin * 0.15); // Ensure a minimum radius of 100px
  });

  // Computed style for the dynamic overlay
  overlayStyle = computed(() => {
    const effect = this.sceneEffect();
    if (effect === 'flashlight') {
      return {
        background: `radial-gradient(circle at ${this.flashlightX()}px ${this.flashlightY()}px, transparent ${this.dynamicFlashlightRadius()}px, rgba(0,0,0,0.9) 100%)`,
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
