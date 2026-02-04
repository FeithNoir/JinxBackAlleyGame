export interface CharacterProps {
  eyes: string;
  mouth: string;
  leftArm: string;
  rightArm: string;
  head?: string;
  top?: string;
  underwearTop?: string;
  bottom?: string;
  underwearBottom?: string;
  stockings?: string;
  feet?: string;
  toy?: string;
  effects?: {
    head?: string;   // blush, heat, mean
    bottom?: string; // fluid-1
    feet?: string;   // fluid-2
    overlay?: string; // parallel-lines, biri-biri, action-lines
    body?: string;   // fluid-3
  };
}
