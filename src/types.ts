
export type Difficulty = 'Easy' | 'Classic' | 'Challenging';

export type Theme = 'Lollipop' | 'Animals';

export type PegColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'darkBlue' | 'pink';

export interface DifficultyConfig {
  pegs: number;
  attempts: number;
  colorCount: number;
}

export type GameStatus = 'MENU' | 'PLAYING' | 'WON' | 'LOST';

export interface GameStats {
  moves: number;
  time: number;
  history: Attempt[];
}

export interface Attempt {
  colors: (PegColor | null)[];
  feedback: {
    perfect: number; // Correct color & position
    partial: number; // Correct color, wrong position
  } | null;
}
