'use client';

import { useTheme } from '@/lib/theme-context';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-300
        bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600
        text-gray-700 dark:text-slate-200 hover:shadow-md"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.121-2.121a.5.5 0 00-.707 0l-.707.707-2.121-2.121a.5.5 0 00-.707 0l-.707.707 2.121 2.121a.5.5 0 000 .707l.707.707-2.121 2.121a.5.5 0 000 .707l.707.707 2.121-2.121a.5.5 0 00.707 0l.707-.707 2.121 2.121a.5.5 0 00.707 0l.707-.707-2.121-2.121a.5.5 0 000-.707l-.707-.707 2.121-2.121a.5.5 0 000-.707l-.707-.707zm2.828-8.104a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.828 8.104a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zm-8.59-8.59a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zM9 11a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm5.414-5.414a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zM3 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm9-16a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm5.414 14.414a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zm-8.59-8.59a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
