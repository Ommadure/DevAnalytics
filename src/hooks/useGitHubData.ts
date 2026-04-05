import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUserData, fetchUserRepositories, clearData, addSearchHistory } from '../features/github/githubSlice';

export function useGitHubData(debouncedUsername: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, repositories, loading, error } = useSelector((state: RootState) => state.github);

  useEffect(() => {
    if (debouncedUsername.trim() === '') {
      dispatch(clearData());
      return;
    }

    const fetchData = async () => {
      // First fetch user data
      const userResult = await dispatch(fetchUserData(debouncedUsername));
      
      // If user is successfully fetched, fetch their repositories
      if (fetchUserData.fulfilled.match(userResult)) {
        dispatch(addSearchHistory(debouncedUsername));
        dispatch(fetchUserRepositories(debouncedUsername));
      }
    };

    fetchData();
  }, [debouncedUsername, dispatch]);

  return { user, repositories, loading, error };
}
