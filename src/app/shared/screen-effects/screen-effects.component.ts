import {
  Component,
  inject,
  ChangeDetectionStrategy,
  HostListener,
  signal,
  computed,
  input,
  ElementRef,
  effect,
} from '@angular/core';
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
    '[class.vibrate]': 'eventService.isVibrating()', // Apply vibrate class to host
  },
})
export class ScreenEffectsComponent {
  protected eventService = inject(EventService);
  private elementRef = inject(ElementRef<HTMLElement>);

  // Input to control scene effects
  sceneEffect = input<'flashlight' | 'night' | 'none'>('none');

  // Flashlight position (Local Signals)
  flashlightX = signal<number>(0);
  flashlightY = signal<number>(0);
  private pointerInside = signal(false);

  // Dynamic flashlight radius (relative to the scene, not the whole window)
  private dynamicFlashlightRadius = computed(() => {
    const el = this.elementRef.nativeElement;
    const width = el?.clientWidth || window.innerWidth;
    const height = el?.clientHeight || window.innerHeight;
    return Math.max(170, Math.min(width, height) * 0.34);
  });

  // Computed style for the dynamic overlay
  overlayStyle = computed(() => {
    const effect = this.sceneEffect();
    if (effect === 'flashlight') {
      const x = this.flashlightX();
      const y = this.flashlightY();
      const r = this.dynamicFlashlightRadius();
      return {
        // Halo cálido + borde suave: se ve la escena dentro del haz sin
        // dejar el resto en negro absoluto.
        background: [
          `radial-gradient(circle at ${x}px ${y}px, rgba(255, 244, 196, .14) 0%, rgba(255, 244, 196, 0) ${r * 0.42}px)`,
          `radial-gradient(circle at ${x}px ${y}px, rgba(0, 0, 0, 0) ${r * 0.55}px, rgba(0, 0, 0, .35) ${r * 0.8}px, rgba(0, 0, 0, .78) ${r * 1.15}px, rgba(0, 0, 0, .9) 100%)`,
        ].join(', '),
        'pointer-events': 'none',
        'z-index': '1000',
      };
    } else if (effect === 'night') {
      return {
        background: 'linear-gradient(rgba(6, 10, 26, .58), rgba(6, 10, 26, .72))',
        'pointer-events': 'none',
        'z-index': '999',
      };
    }
    return {
      background: 'transparent',
      'pointer-events': 'none',
      'z-index': 'auto',
    };
  });

  constructor() {
    // Al entrar en una escena con linterna, el haz arranca centrado en la
    // escena (antes se quedaba en la esquina superior izquierda). El centrado
    // espera a que el layout tenga tamaño real.
    effect(() => {
      if (this.sceneEffect() === 'flashlight') {
        this.pointerInside.set(false);
        this.centerWhenReady();
      }
    });
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (this.sceneEffect() === 'flashlight' && !this.pointerInside()) {
      this.centerWhenReady();
    }
  }

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if (this.sceneEffect() === 'flashlight') {
      this.updateFlashlight(event.clientX, event.clientY);
    }
  }

  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  handleTouch(event: TouchEvent): void {
    const touch = event.touches[0];
    if (this.sceneEffect() === 'flashlight' && touch) {
      this.updateFlashlight(touch.clientX, touch.clientY);
    }
  }

  private updateFlashlight(clientX: number, clientY: number): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    // Si el puntero está sobre el sidebar/menús, dejamos el haz donde estaba
    // en vez de pegarlo al borde de la escena.
    this.pointerInside.set(inside);
    if (!inside) return;

    this.flashlightX.set(this.clamp(clientX - rect.left, 0, rect.width));
    this.flashlightY.set(this.clamp(clientY - rect.top, 0, rect.height));
  }

  private centerWhenReady(attempt = 0): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    if ((!rect.width || !rect.height) && attempt < 8) {
      // setTimeout en vez de rAF: algunos entornos (headless/webviews) no
      // ejecutan requestAnimationFrame y el haz se quedaba en 0,0.
      setTimeout(() => this.centerWhenReady(attempt + 1), 50);
      return;
    }
    this.centerFlashlight();
  }

  private centerFlashlight(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.flashlightX.set(rect.width / 2);
    this.flashlightY.set(rect.height * 0.42);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
