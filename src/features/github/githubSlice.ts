import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Repository } from '../../utils/dataProcessing';

export interface UserData {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GithubState {
  user: UserData | null;
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  searchHistory: string[];
}

const initialState: GithubState = {
  user: null,
  repositories: [],
  loading: false,
  error: null,
  searchHistory: [],
};

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
});

// Thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'github/fetchUserData',
  async (username: string, { rejectWithValue }) => {
    try {
      const safeUsername = encodeURIComponent(username.trim());
      const response = await githubApi.get<UserData>(`/users/${safeUsername}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return rejectWithValue('User not found');
      }
      const message = axios.isAxiosError(error) ? error.message : 'Failed to fetch user data';
      return rejectWithValue(message);
    }
  }
);

// Thunk for fetching repositories (fetching all pages if needed, but for now max 100 for simplicity)
export const fetchUserRepositories = createAsyncThunk(
  'github/fetchUserRepositories',
  async (username: string, { rejectWithValue }) => {
    try {
      // For simplicity, fetch up to 100 repositories
      const safeUsername = encodeURIComponent(username.trim());
      const response = await githubApi.get<Repository[]>(`/users/${safeUsername}/repos?per_page=100&sort=updated`);
      return response.data;
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.message : 'Failed to fetch repositories';
      return rejectWithValue(message);
    }
  }
);

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    clearData: (state) => {
      state.user = null;
      state.repositories = [];
      state.error = null;
    },
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const username = action.payload;
      if (!state.searchHistory.includes(username)) {
        state.searchHistory = [username, ...state.searchHistory].slice(0, 5); // Keep last 5
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        // Keep loading true because we usually fetch repos next
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.repositories = [];
      })
      .addCase(fetchUserRepositories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRepositories.fulfilled, (state, action: PayloadAction<Repository[]>) => {
        state.repositories = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearData, addSearchHistory } = githubSlice.actions;
export default githubSlice.reducer;
