import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '@services/character.service';
import { GameService } from '@services/game.service';
import { LoadingService } from '@services/loading.service';
import { CharacterComponent } from '@shared/character/character.component';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArcadeComponent implements OnInit {
  private characterService = inject(CharacterService);
  private gameService = inject(GameService);
  private loadingService = inject(LoadingService);

  // Use service signal directly
  characterProps = this.characterService.characterProps;

  ngOnInit(): void {
    this.loadingService.show();
    this.characterService.setMode('arcade');
    this.loadingService.hide();
  }

  onInteract(part: string): void {
    this.gameService.interactWith(part);
  }
}
