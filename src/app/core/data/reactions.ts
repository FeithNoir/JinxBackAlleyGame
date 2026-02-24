import { GameReactions } from '@interfaces/game-reactions.interface';

export const GAME_REACTIONS: GameReactions = {
  interaction: {
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
  },
  miniGame: {
    progress: {
      low: "Wait! What are you doing?",
      medium: "Stop! That... that feels weird!",
      high: "I can't... concentrate! Stop it!",
    },
    end: {
      success: "Uwah! You actually did it!",
      failure: "Hah! Too slow!",
    }
  }
};
