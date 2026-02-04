import { Component, input, output, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterProps } from '@interfaces/character-props.interface';
import { EventService } from '@services/event.service';
import { CharacterService } from '@services/character.service';
import { MiniGameComponent } from '@shared/mini-game/mini-game.component';

@Component({
    selector: 'app-character',
    standalone: true,
    imports: [CommonModule, MiniGameComponent],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterComponent {
    private eventService = inject(EventService);
    private characterService = inject(CharacterService);

    // Signal Inputs
    characterProps = input.required<CharacterProps>();
    isVibrating = input<boolean>(false);
    isFlashing = input<boolean>(false);
    isFlashlightMode = input<boolean>(false);
    flashlightX = input<number>(0);
    flashlightY = input<number>(0);

    interact = output<string>();

    // Linked Signals from Services
    reactionText = this.characterService.reactionText;

    // Computed signals
    effects = computed(() => this.characterProps().effects || {});

    onZoneClick(zone: string): void {
        this.interact.emit(zone);
        this.eventService.vibrate(50); // Short vibration feedback
    }
}
