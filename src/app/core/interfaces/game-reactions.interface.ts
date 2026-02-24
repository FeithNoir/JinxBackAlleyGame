export interface InteractionReactions {
  head: { annoyed: string; nervous: string; happy: string; [key: string]: string; };
  top: { annoyed: string; nervous: string; happy: string; [key: string]: string; };
  bottom: { annoyed: string; nervous: string; happy: string; [key: string]: string; };
  [key: string]: { annoyed: string; nervous: string; happy: string; [key: string]: string; }; // Allow string indexing
}

export interface MiniGameProgressReactions {
  low: string;
  medium: string;
  high: string;
}

export interface MiniGameEndReactions {
  success: string;
  failure: string;
}

export interface MiniGameReactions {
  progress: MiniGameProgressReactions;
  end: MiniGameEndReactions;
}

export interface GameReactions {
  interaction: InteractionReactions;
  miniGame: MiniGameReactions;
}
