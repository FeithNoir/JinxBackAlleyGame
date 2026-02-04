import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../interfaces/game-state.interface';
import { DIALOGUE_DATA } from '../data/dialogues';
import { DialogueNode } from '../interfaces/dialogue-node.interface';
import { CharacterService } from './character.service';
import { MiniGameService } from './mini-game.service';
import { StorageService } from './storage.service';
import { EventService } from './event.service';

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

  private isAskingName = new BehaviorSubject<boolean>(false);
  public isAskingName$ = this.isAskingName.asObservable();

  constructor(
    private eventService: EventService,
    private characterService: CharacterService,
    private miniGameService: MiniGameService,
    private storageService: StorageService
  ) {
    this.loadGame();
  }

  private async loadGame(): Promise<void> {
    const savedState = await this.storageService.load('gameState');
    if (savedState) {
      this.gameState.next(savedState);
      this.characterService.setProps(savedState.characters['jinx']);
    } else {
      this.loadInitialState();
    }
  }

  public async saveGame(): Promise<boolean> {
    const success = await this.storageService.save('gameState', this.gameState.getValue());
    if (!success) {
      console.warn('GameService: Failed to save game state');
    }
    return success;
  }

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

    if (!node) return undefined;

    // Process text to replace placeholders
    let processedText = node.text;
    if (currentState.playerName) {
      processedText = processedText.replace(/{playerName}/g, currentState.playerName);
    }

    const processedNode = { ...node, text: processedText };

    if (processedNode.options) {
      // Filter options by chaos requirement
      const filteredOptions = processedNode.options.filter(opt =>
        !opt.chaosRequirement || currentState.chaosLevel >= opt.chaosRequirement
      );
      return { ...processedNode, options: filteredOptions };
    }

    return processedNode;
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

      // Apply presets if present
      if (nextNode.presets) {
        nextNode.presets.forEach(p => {
          this.characterService.applyPreset(p.type, p.id);
        });
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

      this.saveGame();
      this.checkAndTriggerEffects(numericId);

      // Check for name request
      if (nextNode.metadata?.type === 'NAME_REQUEST') {
        this.isAskingName.next(true);
      }
    }
  }

  public setPlayerName(name: string): void {
    const currentState = this.gameState.getValue();
    this.gameState.next({
      ...currentState,
      playerName: name
    });
    this.isAskingName.next(false);
    this.saveGame();

    // Advance dialogue after setting name
    const currentNode = this.getCurrentNode();
    if (currentNode?.nextNodeId) {
      this.selectOption(currentNode.nextNodeId);
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

    // Find interaction text (can be externalized later)
    const reactions: Record<string, Record<string, string>> = {
      'head': {
        'annoyed': "Don't touch my hair...",
        'nervous': "Wait... what are you doing?",
        'happy': "Hehe, that feels nice..."
      },
      'top': {
        'annoyed': "Keep your hands off.",
        'nervous': "Uff, is it getting hot in here?",
        'happy': "I like it when you do that."
      },
      'bottom': {
        'annoyed': "Hey! Watch it.",
        'nervous': "I-if you keep doing that...",
        'happy': "Mmm... don't stop."
      }
    };

    const text = reactions[part]?.[mood] || '...';

    // Show in speech bubble
    this.characterService.showReaction(text);

    // Trigger mini-game if chaos is high (> 60)
    if (this.characterService.getMode() === 'history' && chaos > 60) {
      if (part === 'top' || part === 'bottom') {
        this.miniGameService.start(10);
      }
    }

    // Apply expression change based on mood
    if (mood === 'annoyed') this.characterService.applyPreset('expression', 'mad');
    if (mood === 'nervous') this.characterService.applyPreset('expression', 'nervous');
    if (mood === 'happy') this.characterService.applyPreset('expression', 'happy');

    // Trigger effects
    this.eventService.vibrate(200);
  }
}
