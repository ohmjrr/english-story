import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-all transform hover:scale-110 border-2 border-white/30 dark:border-gray-600"
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-300 animate-spin-slow" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-200" />
      )}
    </button>
  );
}