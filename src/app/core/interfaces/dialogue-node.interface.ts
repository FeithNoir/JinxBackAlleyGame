import { CharacterProps } from './character-props.interface';

export interface DialogueOption {
  text: string;
  nextNodeId: number;
  chaosRequirement?: number;
  chaosChange?: number;
  /** Solo se muestra si el inventario contiene este ítem. */
  requiresItem?: string;
  /** Solo se muestra si el jugador tiene este flag. */
  requiresFlag?: string;
  /** Flag que se activa al elegir la opción. */
  setsFlag?: string;
  action?: () => void;
}

export interface DialogueNode {
  id: number;
  character: string;
  text: string;
  characterProps?: Partial<CharacterProps>;
  sceneEffect?: 'flashlight' | 'night' | 'none';
  nextNodeId?: number;
  chaosChange?: number;
  isInteraction?: boolean;
  presets?: { type: 'outfit' | 'expression', id: string }[];
  metadata?: {
    part?: string;
    mood?: string;
    type?: string;
    item?: string; // Added for inventory items
    flag?: string; // SET_FLAG
    /** CHAOS_BRANCH: se elige el primer branch cuyo minChaos se cumpla (ordenar de mayor a menor). */
    branches?: { minChaos: number; nodeId: number }[];
    /** ENDING: nombre del final desbloqueado. */
    ending?: string;
  };
  /** Pista contextual que el botón "Pista" muestra en este nodo. */
  hint?: string;
  options?: DialogueOption[];
}
