import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CharacterProps } from '@interfaces/character-props.interface';
import { CharacterService } from '@services/character.service';
import { EventService } from '@services/event.service';
import { MiniGameComponent } from '@shared/mini-game/mini-game.component';

@Component({
    selector: 'app-character',
    standalone: true,
    imports: [CommonModule, MiniGameComponent],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterComponent implements OnInit, OnDestroy {
    private characterService = inject(CharacterService);
    private eventService = inject(EventService);

    @Input() characterProps: CharacterProps | undefined;
    @Input() isVibrating = false;
    @Input() isFlashing = false;
    @Input() isFlashlightMode = false;
    @Input() flashlightX = 0;
    @Input() flashlightY = 0;

    @Output() interact = new EventEmitter<string>();

    reactionText = '';
    private subs = new Subscription();

    ngOnInit(): void {
        this.subs.add(
            this.characterService.reactionText$.subscribe(text => {
                this.reactionText = text;
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    onZoneClick(part: string): void {
        this.interact.emit(part);
    }
}
