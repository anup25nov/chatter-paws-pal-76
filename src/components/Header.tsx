
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-10 w-full transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DevxTools
          </Link>
          <span className="bg-primary/10 text-primary px-1.5 py-0.5 text-xs font-medium rounded">
            DEV
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground hidden md:block">
            Professional Developer Tools
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
