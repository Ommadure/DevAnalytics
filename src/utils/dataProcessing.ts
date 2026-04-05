export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
}

export function calculateLanguageDistribution(repos: Repository[]) {
  const languageMap: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languageMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getStarsPerRepo(repos: Repository[]) {
  return repos
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10); // top 10 repos by stars
}

export function groupReposByCreationDate(repos: Repository[]) {
  const yearMap: Record<string, number> = {};

  repos.forEach((repo) => {
    const year = new Date(repo.created_at).getFullYear().toString();
    yearMap[year] = (yearMap[year] || 0) + 1;
  });

  return Object.entries(yearMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

export function calculateTotalStars(repos: Repository[]): number {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}
