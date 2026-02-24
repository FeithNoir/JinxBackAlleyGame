import { Injectable, inject, signal } from '@angular/core';
import { GameState } from '@interfaces/game-state.interface';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { CharacterService } from '@services/character.service';
import { MiniGameService } from '@services/mini-game.service';
import { StorageService } from '@services/storage.service';
import { EventService } from '@services/event.service';
import { MiniGameType } from '@core/interfaces/mini-game-type.enum';
import { GAME_REACTIONS } from '@data/reactions';
import { DialogueRepositoryService } from '@services/dialogue-repository.service';
import { InventoryItem } from '@interfaces/inventory-item.interface';
import { INVENTORY_ITEMS_DATA } from '@data/inventory-items.data';

const INITIAL_GAME_STATE: GameState = {
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
  inventory: [], // Initialize inventory
};

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private eventService = inject(EventService);
  private characterService = inject(CharacterService);
  private miniGameService = inject(MiniGameService);
  private storageService = inject(StorageService);
  private dialogueRepositoryService = inject(DialogueRepositoryService);

  // Signals
  private gameStateSignal = signal<GameState>(INITIAL_GAME_STATE);
  public gameState = this.gameStateSignal.asReadonly();

  private isAskingNameSignal = signal<boolean>(false);
  public isAskingName = this.isAskingNameSignal.asReadonly();

  private isInventoryOpenSignal = signal<boolean>(false);
  public isInventoryOpen = this.isInventoryOpenSignal.asReadonly();

  constructor() {
    this.loadGame();
  }

  private async loadGame(): Promise<void> {
    const savedState = await this.storageService.load('gameState');
    if (savedState) {
      this.gameStateSignal.set(savedState);
      this.characterService.setProps(savedState.characters['jinx']);
    } else {
      this.loadInitialState();
    }
  }

  public async saveGame(): Promise<boolean> {
    const success = await this.storageService.save('gameState', this.gameStateSignal());
    if (!success) {
      console.warn('GameService: Failed to save game state');
    }
    return success;
  }

  public loadInitialState(): void {
    this.gameStateSignal.set(INITIAL_GAME_STATE);
    this.characterService.setProps(INITIAL_GAME_STATE.characters['jinx']);
    this.characterService.setMode('history');
    this.checkAndTriggerEffects(INITIAL_GAME_STATE.currentNodeId);
  }

  public getCurrentNode(): DialogueNode {
    const currentState = this.gameStateSignal();
    const currentNodeId = currentState.currentNodeId;
    const node = this.dialogueRepositoryService.getDialogueNode(currentNodeId);

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
    const resolvedNodeId = this.resolveNextNodeId(numericId);
    const currentState = this.gameStateSignal();
    const currentNode = this.dialogueRepositoryService.getDialogueNode(currentState.currentNodeId);
    const selectedOption = currentNode?.options?.find(opt => opt.nextNodeId === numericId);
    const nextNode = this.dialogueRepositoryService.getDialogueNode(resolvedNodeId);

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

      // Handle INVENTORY_ADD metadata
      if (nextNode.metadata?.type === 'INVENTORY_ADD' && nextNode.metadata?.item) {
        this.addItemToInventory(nextNode.metadata.item);
      }

      this.gameStateSignal.set({
        ...currentState,
        currentNodeId: resolvedNodeId,
        chaosLevel: newChaosLevel,
        characters: newCharactersState,
      });

      if (newCharactersState['jinx']) {
        this.characterService.setProps(newCharactersState['jinx']);
      }

      this.saveGame();
      this.checkAndTriggerEffects(resolvedNodeId);

      // Check for name request
      if (nextNode.metadata?.type === 'NAME_REQUEST') {
        this.isAskingNameSignal.set(true);
      }
    }
  }

  private resolveNextNodeId(nodeId: number): number {
    const node = this.dialogueRepositoryService.getDialogueNode(nodeId);
    if (!node) return nodeId;

    const chaosLevel = this.gameStateSignal().chaosLevel;

    if (node.metadata?.type === 'OFFER_OUTFIT') {
      if (chaosLevel < 20) return 231;
      if (chaosLevel < 40) return 232;
      return 233;
    }

    if (node.metadata?.type === 'NAKED_SUGGEST') {
      if (chaosLevel < 20) return 241;
      if (chaosLevel < 40) return 242;
      return 243;
    }

    return nodeId;
  }

  public setPlayerName(name: string): void {
    const currentState = this.gameStateSignal();
    this.gameStateSignal.set({
      ...currentState,
      playerName: name
    });
    this.isAskingNameSignal.set(false);
    this.saveGame();

    // Advance dialogue after setting name
    const currentNode = this.getCurrentNode();
    if (currentNode?.nextNodeId) {
      this.selectOption(currentNode.nextNodeId);
    }
  }

  public addItemToInventory(itemId: string): void {
    const itemToAdd = INVENTORY_ITEMS_DATA[itemId];
    if (!itemToAdd) {
      console.warn(`Attempted to add unknown item: ${itemId}`);
      return;
    }

    this.gameStateSignal.update(state => {
      const existingItemIndex = state.inventory.findIndex(item => item.id === itemId);
      if (existingItemIndex > -1) {
        // Item already exists, just increment quantity
        const updatedInventory = [...state.inventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: updatedInventory[existingItemIndex].quantity + 1
        };
        return { ...state, inventory: updatedInventory };
      } else {
        // Add new item
        return { ...state, inventory: [...state.inventory, { ...itemToAdd, quantity: 1 }] };
      }
    });
    this.saveGame();
  }

  public toggleInventory(): void {
    this.isInventoryOpenSignal.update(val => !val);
  }

  private checkAndTriggerEffects(nodeId: number): void {
    const node = this.dialogueRepositoryService.getDialogueNode(nodeId);
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
    const currentState = this.gameStateSignal();
    const chaos = currentState.chaosLevel;

    let mood = '';
    if (chaos <= 30) mood = 'annoyed';
    else if (chaos <= 70) mood = 'nervous';
    else mood = 'happy';

    // Find interaction text (can be externalized later)
    const text = GAME_REACTIONS.interaction[part]?.[mood] || '...';

    // Show in speech bubble
    this.characterService.showReaction(text);

    // Trigger mini-game if chaos is high (> 60)
    if (this.characterService.getMode() === 'history' && chaos > 60) {
      if (part === 'top' || part === 'bottom') {
        this.miniGameService.start(MiniGameType.Clicker, 10);
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
