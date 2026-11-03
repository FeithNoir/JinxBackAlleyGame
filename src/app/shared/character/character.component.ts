import { Component, input, output, inject, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CharacterProps } from '@interfaces/character-props.interface';
import { EventService } from '@services/event.service';
import { CharacterService } from '@services/character.service';
import { CharacterAssetService } from '@services/character-asset.service';

@Component({
    selector: 'app-character',
    standalone: true,
    imports: [],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
      'class': 'app-character-enter',
      '[class.show-hotspots]': 'showHotspots()'
    }
})
export class CharacterComponent {
    private eventService = inject(EventService);
    private characterService = inject(CharacterService);
    protected characterAssetService = inject(CharacterAssetService);

    // Signal Inputs
    characterProps = input.required<CharacterProps>();
    isVibrating = input<boolean>(false);
    isFlashing = input<boolean>(false);
    isFlashlightMode = input<boolean>(false);
    flashlightX = input<number>(0);
    flashlightY = input<number>(0);
    /** Solo el modo arcade puede mostrar las zonas interactivas resaltadas. */
    showHotspots = input<boolean>(false);

    interact = output<string>();

    // Linked Signals from Services
    reactionText = this.characterService.reactionText;

    // Computed signals
    effects = computed(() => this.characterProps().effects || {});

    /** El cuerpo ya cargó: ocultamos la silueta de respaldo. */
    baseLoaded = signal(false);

    /** Oculta capas cuyo PNG no existe en lugar de mostrar el icono de imagen rota. */
    onImgError(ev: Event): void {
        const img = ev.target as HTMLImageElement;
        img.classList.add('missing');
        if (img.classList.contains('base')) this.baseLoaded.set(false);
    }

    /** Fundido suave al cargar/cambiar una capa (evita el cambio brusco de modelo). */
    onImgLoad(ev: Event): void {
        const img = ev.target as HTMLImageElement;
        img.classList.remove('missing');
        if (img.classList.contains('base')) {
            // El cuerpo se muestra entero de golpe: si lo fundiéramos, la
            // silueta desaparecería dejando un instante de personaje tenue.
            this.baseLoaded.set(true);
            return;
        }
        img.classList.remove('layer-loaded');
        void img.offsetWidth; // reinicia la animación
        img.classList.add('layer-loaded');
    }

    onZoneClick(zone: string): void {
        this.interact.emit(zone);
        this.eventService.vibrate(50); // Short vibration feedback
    }
}
