import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterProps } from '../../core/interfaces/character-props.interface';
import { CharacterService } from '../../core/services/character.service';
import { EventService } from '../../core/services/event.service';
import { Subscription } from 'rxjs';
import { MiniGameComponent } from '../mini-game/mini-game.component';

@Component({
    selector: 'app-character',
    standalone: true,
    imports: [CommonModule, MiniGameComponent],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css'
})
export class CharacterComponent implements OnInit, OnDestroy {
    @Input() characterProps: CharacterProps | undefined;
    @Input() isVibrating = false;
    @Input() isFlashing = false;
    @Input() isFlashlightMode = false;
    @Input() flashlightX = 0;
    @Input() flashlightY = 0;

    @Output() interact = new EventEmitter<string>();

    reactionText = '';
    private subs = new Subscription();

    constructor(
        private characterService: CharacterService,
        private eventService: EventService
    ) { }

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
