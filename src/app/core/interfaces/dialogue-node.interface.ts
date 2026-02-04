import { CharacterProps } from './character-props.interface';

export interface DialogueOption {
  text: string;
  nextNodeId: number;
  chaosRequirement?: number;
  chaosChange?: number;
  action?: () => void;
}

export interface DialogueNode {
  id: number;
  character: string;
  text: string;
  characterProps?: Partial<CharacterProps>;
  nextNodeId?: number;
  chaosChange?: number;
  options?: DialogueOption[];
}
