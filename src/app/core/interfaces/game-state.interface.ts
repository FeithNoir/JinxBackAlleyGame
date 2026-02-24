import { CharacterProps } from './character-props.interface';

export interface GameState {
  playerName?: string;
  currentNodeId: number;
  chaosLevel: number;
  characters: {
    [characterName: string]: CharacterProps;
  };
  playerFlags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
