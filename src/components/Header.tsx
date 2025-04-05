
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

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
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-10 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-20 px-4">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
              DevxTools
            </Link>
          </motion.div>
          <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-medium rounded">
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
    </motion.header>
  );
};

export default Header;
