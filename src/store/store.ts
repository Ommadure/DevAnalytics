import { configureStore } from '@reduxjs/toolkit';
import githubReducer from '../features/github/githubSlice';
import themeReducer from '../features/themeSlice';

export const store = configureStore({
  reducer: {
    github: githubReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
