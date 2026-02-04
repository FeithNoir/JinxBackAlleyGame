import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../interfaces/game-state.interface';
import { DIALOGUE_DATA } from '../data/dialogues';
import { DialogueNode } from '../interfaces/dialogue-node.interface';
import { EventService } from './event.service';
import { CharacterService } from './character.service';

const INITIAL_GAME_STATE: GameState = {
  id: 1,
  currentNodeId: 100,
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

  constructor(
    private eventService: EventService,
    private characterService: CharacterService
  ) { }

  public loadInitialState(): void {
    this.gameState.next(INITIAL_GAME_STATE);
    this.characterService.setProps(INITIAL_GAME_STATE.characters['jinx']);
    this.characterService.setMode('history');
    this.checkAndTriggerEffects(INITIAL_GAME_STATE.currentNodeId);
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

  public selectOption(nextNodeId: number | string): void {
    const numericId = typeof nextNodeId === 'string' ? parseInt(nextNodeId) : nextNodeId;
    const currentState = this.gameState.getValue();
    const currentNode = DIALOGUE_DATA.find(node => node.id === currentState.currentNodeId);
    const selectedOption = currentNode?.options?.find(opt => opt.nextNodeId === numericId);
    const nextNode = DIALOGUE_DATA.find(node => node.id === numericId);

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
        currentNodeId: numericId,
        chaosLevel: newChaosLevel,
        characters: newCharactersState,
      });

      if (newCharactersState['jinx']) {
        this.characterService.setProps(newCharactersState['jinx']);
      }

      this.checkAndTriggerEffects(numericId);
    }
  }

  private checkAndTriggerEffects(nodeId: number): void {
    const node = DIALOGUE_DATA.find(n => n.id === nodeId);
    if (!node) return;

    const overlay = node.characterProps?.effects?.overlay;

    if (overlay === 'biri-biri') {
      this.eventService.vibrate();
    } else if (overlay === 'action-lines') {
      this.eventService.vibrate();
      this.eventService.flash();
    }
  }

  public interactWith(part: string): void {
    const currentState = this.gameState.getValue();
    const chaos = currentState.chaosLevel;

    let mood = '';
    if (chaos <= 30) mood = 'annoyed';
    else if (chaos <= 70) mood = 'nervous';
    else mood = 'happy';

    // Find a reaction node based on part and mood
    const reactionNode = DIALOGUE_DATA.find(n =>
      n.isInteraction && n.metadata?.part === part && n.metadata?.mood === mood
    );

    if (reactionNode) {
      this.selectOption(reactionNode.id);
    }
  }
}
