import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService, DEFAULT_JINX_PROPS } from '../../core/services/character.service';
import { CharacterComponent } from '../../shared/character/character.component';
import { CharacterProps } from '../../core/interfaces/character-props.interface';
import { Subscription } from 'rxjs';
import { GameService } from '../../core/services/game.service';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css'
})
export class ArcadeComponent implements OnInit, OnDestroy {
  characterProps: CharacterProps | undefined;
  private subs = new Subscription();

  constructor(
    private characterService: CharacterService,
    private gameService: GameService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.characterService.setMode('arcade');

    this.subs.add(
      this.characterService.characterProps$.subscribe(props => {
        this.characterProps = props;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }
}
