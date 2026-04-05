import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Github } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleDarkMode } from '../../features/themeSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { motion } from 'framer-motion';

interface NavbarProps {
  onSearch: (username: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 600);
  const dispatch = useDispatch();
  
  const { user } = useSelector((state: RootState) => state.github);
  const { darkMode } = useSelector((state: RootState) => state.theme);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Github className="h-8 w-8 text-slate-900 dark:text-white" />
            <span className="font-bold text-xl hidden sm:block text-slate-900 dark:text-white">
              DevAnalytics
            </span>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-full leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
                placeholder="Search GitHub username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions: Profile Preview & Theme Toggle */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-8 w-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user.login}
                </span>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
