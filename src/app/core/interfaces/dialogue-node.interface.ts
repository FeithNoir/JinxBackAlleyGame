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
  sceneEffect?: 'flashlight' | 'none';
  nextNodeId?: number;
  chaosChange?: number;
  isInteraction?: boolean;
  presets?: { type: 'outfit' | 'expression', id: string }[];
  metadata?: {
    part?: string;
    mood?: string;
    type?: string;
  };
  options?: DialogueOption[];
}
