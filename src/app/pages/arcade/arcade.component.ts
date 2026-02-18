import { Component, OnInit, inject, computed, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '@services/character.service';
import { GameService } from '@services/game.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';
import { MiniGameService } from '@services/mini-game.service';
import { MiniGameType } from '@interfaces/mini-game-type.enum';
import { Subject, takeUntil } from 'rxjs';
import { MiniGameComponent } from '@shared/mini-game/mini-game.component';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CommonModule, CharacterComponent, MiniGameComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArcadeComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private gameService = inject(GameService);
  private loadingService = inject(LoadingService);
  protected miniGameService = inject(MiniGameService); // Make protected to use in template
  private destroy$ = new Subject<void>();

  protected backgroundStyle: string = "url('background/bg-1.png')";

  // Use service signal directly
  characterProps = this.characterService.characterProps;

  ngOnInit(): void {
    this.loadingService.show();
    this.characterService.setMode('arcade');
    this.loadingService.hide();

    this.miniGameService.miniGameEnded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ success, type }) => {
        console.log(`Mini-game ${type} ended. Success: ${success}`);
        // Here you can add logic to update game state, award items, etc.
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }

  startClickerMiniGame(): void {
    this.miniGameService.start(MiniGameType.Clicker);
  }
}
