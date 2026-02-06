'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-9 w-9 border border-border bg-background hover:border-danish-red/40 hover:bg-danish-red/5 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4 flex-shrink-0" />
      ) : (
        <Moon className="h-4 w-4 flex-shrink-0" />
      )}
    </button>
  );
}
