import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../core/services/game.service';
import { GameState } from '../../core/interfaces/game-state.interface';
import { DialogueNode } from '../../core/interfaces/dialogue-node.interface';
import { Subscription } from 'rxjs';
import { CharacterProps } from '../../core/interfaces/character-props.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {
  gameState!: GameState;
  currentNode!: DialogueNode | undefined;
  characterProps: CharacterProps | undefined;
  private gameStateSubscription!: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.loadInitialState();
    this.gameStateSubscription = this.gameService.gameState$.subscribe(state => {
      this.gameState = state;
      this.currentNode = this.gameService.getCurrentNode();
      if (this.currentNode && this.currentNode.character) {
        this.characterProps = this.gameState.characters[this.currentNode.character];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }
}
