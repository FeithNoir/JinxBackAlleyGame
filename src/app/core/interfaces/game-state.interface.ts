import { CharacterProps } from './character-props.interface';

import { InventoryItem } from './inventory-item.interface';

export interface GameState {
  currentNodeId: number;
  chaosLevel: number;
  characters: {
    [key: string]: { // Add index signature
      eyes: string;
      mouth: string;
      leftArm: string;
      rightArm: string;
      head: string;
      top: string;
      underwearTop: string;
      bottom: string;
      underwearBottom: string;
      stockings: string;
      feet: string;
      effects: { [key: string]: string };
    };
  };
  playerFlags: string[];
  playerName?: string;
  inventory: InventoryItem[];
}
