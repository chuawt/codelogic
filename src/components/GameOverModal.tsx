import React from 'react';
import { motion } from 'motion/react';
import { GameStatus, PegColor, Difficulty, Theme } from '../types';
import { formatTime } from '../lib/gameLogic';
import { COLOR_MAP, THEME_PEGS } from '../constants';
import { Trophy, Skull, RotateCcw, LayoutGrid } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  time: number;
  moves: number;
  secretCode: PegColor[];
  theme: Theme;
  onAgain: () => void;
  onMenu: () => void;
}

export default function GameOverModal({ status, time, moves, secretCode, theme, onAgain, onMenu }: GameOverModalProps) {
  const isWon = status === 'WON';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card w-full max-w-sm p-8 rounded-3xl text-center space-y-6"
      >
        <div className="flex justify-center">
          {isWon ? (
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Trophy size={40} />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/20">
              <Skull size={40} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className={`text-3xl font-bold ${isWon ? 'text-emerald-400' : 'text-red-400'}`}>
            {isWon ? 'CODE BROKEN!' : 'MISSION FAILED'}
          </h2>
          <p className="text-on-surface-variant">
            {isWon ? 'You decrypted the sequence successfully.' : 'The encrypted sequence remained hidden.'}
          </p>
        </div>

        <div className="bg-surface-container rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Actual Code</p>
          <div className="flex justify-center gap-3">
            {secretCode.map((color, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'Lollipop' ? `peg-3d ${COLOR_MAP[color]}` : 'bg-white/10 text-xl'
                }`}
              >
                {theme === 'Disney' && THEME_PEGS.Disney[color]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Time</p>
            <p className="text-xl font-bold text-primary">{formatTime(time)}</p>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Moves</p>
            <p className="text-xl font-bold text-primary">{moves}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onAgain}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
          >
            <RotateCcw size={20} /> Play Again
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-emerald-700/50 border border-emerald-500/30 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700/70 active:scale-[0.98] transition-all"
          >
            <LayoutGrid size={20} /> Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
