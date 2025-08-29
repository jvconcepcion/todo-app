import { ThemeToggleProps } from '@/lib/types';
import { 
  FaSun, 
  FaRegMoon
} from 'react-icons/fa';

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FaRegMoon className="w-6 h-6" />
      ) : (
        <FaSun className="w-6 h-6" />
      )}
    </button>
  );
}

export default ThemeToggle;