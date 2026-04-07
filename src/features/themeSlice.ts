import { createSlice } from '@reduxjs/toolkit';
import { safeLocalStorageGetItem, safeLocalStorageSetItem } from '../lib/storage';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: safeLocalStorageGetItem('darkMode') === 'true' || false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      safeLocalStorageSetItem('darkMode', state.darkMode.toString());
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      safeLocalStorageSetItem('darkMode', state.darkMode.toString());
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
