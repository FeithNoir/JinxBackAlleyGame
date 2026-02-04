import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../interfaces/game-state.interface';
import { DIALOGUE_DATA } from '../data/dialogues';
import { DialogueNode } from '../interfaces/dialogue-node.interface';

const INITIAL_GAME_STATE: GameState = {
  id: 1,
  currentNodeId: 1,
  chaosLevel: 0,
  characters: {
    jinx: {
      eyes: 'e-1',
      mouth: 'm-1',
      leftArm: 'left-1',
      rightArm: 'right-1',
      head: '',
      top: 'top-1',
      underwearTop: 'bandage-1',
      bottom: 'short-1',
      underwearBottom: 'sticker-1',
      stockings: 'stocking-1',
      feet: 'boots-1',
      effects: {},
    },
  },
  playerFlags: [],
};

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameState = new BehaviorSubject<GameState>(INITIAL_GAME_STATE);
  public gameState$: Observable<GameState> = this.gameState.asObservable();

  constructor() { }

  public loadInitialState(): void {
    this.gameState.next(INITIAL_GAME_STATE);
  }

  public getCurrentNode(): DialogueNode | undefined {
    const currentState = this.gameState.getValue();
    const currentNodeId = currentState.currentNodeId;
    const node = DIALOGUE_DATA.find(n => n.id === currentNodeId);

    if (node && node.options) {
      // Filter options by chaos requirement
      const filteredOptions = node.options.filter(opt =>
        !opt.chaosRequirement || currentState.chaosLevel >= opt.chaosRequirement
      );
      return { ...node, options: filteredOptions };
    }

    return node;
  }

  public selectOption(nextNodeId: number): void {
    const currentState = this.gameState.getValue();
    const currentNode = DIALOGUE_DATA.find(node => node.id === currentState.currentNodeId);
    const selectedOption = currentNode?.options?.find(opt => opt.nextNodeId === nextNodeId);
    const nextNode = DIALOGUE_DATA.find(node => node.id === nextNodeId);

    if (nextNode) {
      let newChaosLevel = currentState.chaosLevel;
      // Increment chaos from the selected option or the current node itself
      if (selectedOption?.chaosChange) newChaosLevel += selectedOption.chaosChange;
      if (currentNode?.chaosChange) newChaosLevel += currentNode.chaosChange;

      // Cap chaos level (optional, e.g. at 100)
      newChaosLevel = Math.min(Math.max(newChaosLevel, 0), 100);

      const newCharactersState = { ...currentState.characters };
      if (nextNode.character && nextNode.characterProps) {
        newCharactersState[nextNode.character] = {
          ...newCharactersState[nextNode.character],
          ...nextNode.characterProps,
        };
      }

      this.gameState.next({
        ...currentState,
        currentNodeId: nextNodeId,
        chaosLevel: newChaosLevel,
        characters: newCharactersState,
      });
    }
  }
}
