
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * 
 * In this version, we're enforcing dark mode only.
 * The button is kept for UI consistency but doesn't toggle themes.
 */
const ThemeToggle = () => {
  // Force dark mode on component mount
  useEffect(() => {
    // Set dark mode in local storage and apply to document
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Dark theme is active"
      className="transition-transform hover:rotate-12"
    >
      <Moon className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;
