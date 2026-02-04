import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CharacterService, DEFAULT_JINX_PROPS } from '@services/character.service';
import { GameService } from '@services/game.service';
import { EventService } from '@services/event.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';
import { CharacterProps } from '@interfaces/character-props.interface';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css'
})
export class ArcadeComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private gameService = inject(GameService);
  private eventService = inject(EventService);
  private loadingService = inject(LoadingService);

  characterProps: CharacterProps | undefined;
  private subs = new Subscription();

  ngOnInit(): void {
    this.loadingService.show();
    this.characterService.setMode('arcade');
    this.loadingService.hide();

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
