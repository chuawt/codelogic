import { PegColor } from '../types';

/**
 * Calculates Mastermind feedback.
 * @param code The target secret code
 * @param guess The player's current attempt
 */
export function calculateFeedback(code: PegColor[], guess: PegColor[]) {
  let perfect = 0;
  let partial = 0;

  const codeArr = [...code];
  const guessArr = [...guess];

  // First pass: Perfect matches
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === codeArr[i]) {
      perfect++;
      // Mask indices to avoid double counting
      codeArr[i] = null as any;
      guessArr[i] = null as any;
    }
  }

  // Second pass: Color matches (wrong position)
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === null) continue;
    
    const foundIndex = codeArr.indexOf(guessArr[i]);
    if (foundIndex !== -1) {
      partial++;
      codeArr[foundIndex] = null as any;
    }
  }

  return { perfect, partial };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
