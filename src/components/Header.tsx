
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

/**
 * Header Component
 * 
 * Main navigation header that provides access to the app's branding and theme toggle.
 * Features animation effects using framer-motion and responsive design.
 * 
 * @returns {JSX.Element} The rendered Header component
 */
const Header = () => {
  // Track scroll position to apply background effects
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Apply background when scrolled more than 10px
      setScrolled(window.scrollY > 10);
    };

    // Add scroll listener and clean up on unmount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      // Initial animation state (starts invisible and slightly up)
      initial={{ opacity: 0, y: -20 }}
      // Animation target (fully visible at correct position)
      animate={{ opacity: 1, y: 0 }}
      // Animation timing and easing
      transition={{ duration: 0.5 }}
      // Conditional styling based on scroll position
      className={`sticky top-0 z-10 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-20 px-4">
        {/* Logo and app name */}
        <div className="flex items-center space-x-3">
          <motion.div
            // Interactive hover animation
            whileHover={{ scale: 1.05 }}
            // Spring animation for natural movement
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
              DevxTools
            </Link>
          </motion.div>
          {/* Development environment indicator */}
          <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-medium rounded">
            DEV
          </span>
        </div>
        
        {/* Right side content */}
        <div className="flex items-center space-x-4">
          {/* Tagline (hidden on mobile) */}
          <div className="text-sm text-muted-foreground hidden md:block">
            Professional Developer Tools
          </div>
          {/* Theme toggle button */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
