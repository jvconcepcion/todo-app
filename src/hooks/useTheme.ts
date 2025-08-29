import { useState, useEffect } from 'react';

// Define the theme type to be used by the hook and components
type Theme = 'light' | 'dark';

// The custom hook
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // If no saved theme, check the user's OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Effect to handle side effects when the theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove('light', 'dark');
    
    // Add the new theme class
    root.classList.add(theme);

    // Save the current theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Return the current theme and the function to toggle it
  return [theme, toggleTheme];
}