import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/cards/StatCard';
import { LanguagePieChart } from '../components/charts/LanguagePieChart';
import { StarsBarChart } from '../components/charts/StarsBarChart';
import { TimelineLineChart } from '../components/charts/TimelineLineChart';
import { ContributionGraph } from '../components/charts/ContributionGraph';
import { RepositoryTable } from '../components/RepositoryTable';
import { useGitHubData } from '../hooks/useGitHubData';
import { BookMarked, Users, UserPlus, Star, Loader2, AlertCircle, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateLanguageDistribution, calculateTotalStars, getStarsPerRepo, groupReposByCreationDate } from '../utils/dataProcessing';

export function Dashboard() {
  const [searchUsername, setSearchUsername] = useState('');
  const { user, repositories, loading, error } = useGitHubData(searchUsername);

  const totalStars = repositories ? calculateTotalStars(repositories) : 0;
  const languageData = repositories ? calculateLanguageDistribution(repositories) : [];
  const topReposData = repositories ? getStarsPerRepo(repositories) : [];
  const timelineData = repositories ? groupReposByCreationDate(repositories) : [];

  return (
    <div className="min-h-screen min-w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar onSearch={setSearchUsername} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !user && !error && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Fetching developer data...</p>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[60vh]"
          >
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h2>
            <p className="text-slate-500 dark:text-slate-400">{error}</p>
          </motion.div>
        )}

        {!loading && !user && !error && searchUsername.trim() === '' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
          >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-full shadow-sm mb-6 border border-slate-200 dark:border-slate-700">
              <Github className="h-16 w-16 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Developer Analytics Dashboard
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
              Search for any GitHub username to instantly generate a comprehensive analytics dashboard of their open-source contributions.
            </p>
          </motion.div>
        )}

        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* User Profile Header (Mobile mainly, since navbar has preview) */}
            <div className="sm:hidden flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name || user.login}</h2>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                  @{user.login}
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Repositories" value={user.public_repos} icon={<BookMarked className="w-6 h-6" />} delay={0.1} />
              <StatCard title="Followers" value={user.followers} icon={<Users className="w-6 h-6" />} delay={0.2} />
              <StatCard title="Following" value={user.following} icon={<UserPlus className="w-6 h-6" />} delay={0.3} />
              <StatCard title="Total Stars" value={totalStars} icon={<Star className="w-6 h-6" />} delay={0.4} />
            </div>

            {/* Contribution Graph */}
            <div>
              <ContributionGraph username={user.login} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-[400px]">
                <LanguagePieChart data={languageData} />
              </div>
              <div className="lg:col-span-2 h-[400px]">
                <StarsBarChart data={topReposData} />
              </div>
              <div className="lg:col-span-3 h-[400px]">
                <TimelineLineChart data={timelineData} />
              </div>
            </div>

            {/* Repository Table */}
            <div>
              <RepositoryTable repositories={repositories} />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
