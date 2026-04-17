# DevAnalytics

DevAnalytics is a responsive React + TypeScript dashboard for exploring public GitHub profiles. Enter a GitHub username and the app fetches profile and repository data, then turns it into a clean analytics view with summary cards, charts, a contribution heatmap, and a searchable repository table.

This project is frontend-only in its current form. It talks directly to the public GitHub API from the browser and does not require a backend or database to run locally.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [GitHub API Notes](#github-api-notes)
- [Known Limitations](#known-limitations)
- [Roadmap Ideas](#roadmap-ideas)
- [Contributing](#contributing)
- [License](#license)

## Overview

The app is built to give a quick, visual summary of a developer's public GitHub activity without requiring authentication or setup from the end user. It is a good fit for:

- portfolio-style developer analytics
- public GitHub profile exploration
- open-source activity snapshots
- practicing data visualization with React
- learning how Redux Toolkit can coordinate async data fetching in a dashboard UI

The current app renders a single dashboard route at `/` and focuses on one workflow: search a GitHub username and inspect the resulting analytics.

## Features

- Search any public GitHub username from the top navigation bar
- Debounced search input to reduce unnecessary API calls while typing
- Profile summary cards for:
  - public repositories
  - followers
  - following
  - total stars across fetched repositories
- GitHub contribution heatmap using `react-github-calendar`
- Language distribution pie chart
- Top starred repositories bar chart
- Repository creation timeline line chart
- Sortable and filterable repository table
- Responsive layout for desktop and mobile
- Light/dark theme toggle persisted with `localStorage`
- Subtle motion and transitions with Framer Motion

## Tech Stack

### Core

- React 18
- TypeScript
- Vite

### State and Data

- Redux Toolkit
- React Redux
- Axios

### UI and Visualization

- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- `react-github-calendar`

### Tooling

- ESLint
- PostCSS
- `vite-tsconfig-paths`

## Architecture Overview

The codebase is organized around a small number of focused layers:

- `src/pages/Dashboard.tsx`
  The main screen. It composes the navbar, stats, charts, contribution graph, and repository table.
- `src/components/`
  Reusable UI pieces such as cards, charts, layout, and the repository table.
- `src/features/github/githubSlice.ts`
  Redux state and async thunks for fetching GitHub user and repository data.
- `src/features/themeSlice.ts`
  Redux state for dark mode, including `localStorage` persistence.
- `src/hooks/useGitHubData.ts`
  Connects the dashboard search term to Redux async fetching.
- `src/hooks/useDebounce.ts`
  Delays search updates to avoid firing requests on every keystroke.
- `src/utils/dataProcessing.ts`
  Converts raw repository data into chart-friendly datasets.
- `src/store/store.ts`
  Central Redux store setup.

## Data Flow

1. The user types a GitHub username into the navbar search input.
2. `useDebounce` waits 600ms before forwarding the search term.
3. `Dashboard` passes the debounced username into `useGitHubData`.
4. `useGitHubData` dispatches `fetchUserData`.
5. If the user profile exists, the app stores the username in search history and dispatches `fetchUserRepositories`.
6. The GitHub slice updates global Redux state with loading, success, or error states.
7. `Dashboard` derives chart datasets using helper functions from `src/utils/dataProcessing.ts`.
8. Recharts components render the visual analytics and the repository table renders the detailed list view.

Theme flow is handled separately through the `themeSlice`, which toggles a `dark` class on the root document and stores the preference in `localStorage`.

## Project Structure

```text
DevAnalytics/
|-- public/
|   `-- dev analytics-.png
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- cards/
|   |   |   `-- StatCard.tsx
|   |   |-- charts/
|   |   |   |-- ContributionGraph.tsx
|   |   |   |-- LanguagePieChart.tsx
|   |   |   |-- StarsBarChart.tsx
|   |   |   `-- TimelineLineChart.tsx
|   |   |-- layout/
|   |   |   `-- Navbar.tsx
|   |   |-- Empty.tsx
|   |   `-- RepositoryTable.tsx
|   |-- features/
|   |   |-- github/
|   |   |   `-- githubSlice.ts
|   |   `-- themeSlice.ts
|   |-- hooks/
|   |   |-- useDebounce.ts
|   |   |-- useGitHubData.ts
|   |   `-- useTheme.ts
|   |-- lib/
|   |   |-- storage.ts
|   |   `-- utils.ts
|   |-- pages/
|   |   |-- Dashboard.tsx
|   |   `-- Home.tsx
|   |-- store/
|   |   `-- store.ts
|   |-- utils/
|   |   `-- dataProcessing.ts
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- tsconfig.json
|-- vercel.json
`-- vite.config.ts
```

## Getting Started

### Prerequisites

- A current Node.js LTS version
- `npm`

### Installation

```bash
git clone <your-repository-url>
cd DevAnalytics
npm install
```

### Run the Development Server

```bash
npm run dev
```

Vite will start a local development server and print the local URL in the terminal.

### Create a Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript build checks and creates a production bundle |
| `npm run preview` | Serves the built app locally for preview |
| `npm run lint` | Runs ESLint across the project |
| `npm run check` | Runs TypeScript checking without emitting files |

## Environment Variables

No environment variables are required for the current version of the app.

That said, if you later want to reduce GitHub API rate-limit issues, a common next step would be introducing a backend proxy or an authenticated GitHub token flow. This repository does not implement that yet.

## Deployment

### Vercel

This repository already includes a `vercel.json` file with a rewrite rule:

- all routes are rewritten to `index.html`
- this makes the app work as a single-page application on Vercel

Typical Vercel deployment steps:

1. Import the repository into Vercel.
2. Let Vercel detect the project as a Vite app.
3. Use the default build command: `npm run build`
4. Use the default output directory: `dist`

### Any Static Hosting Provider

You can also deploy the generated `dist/` directory to any static host that supports SPA fallback routing, including:

- Netlify
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

If your host does not automatically rewrite unknown routes to `index.html`, add an SPA fallback rule manually.

## GitHub API Notes

The current app uses public GitHub endpoints directly from the browser:

- `GET /users/:username`
- `GET /users/:username/repos?per_page=100&sort=updated`

Important behavior to know before publishing or deploying:

- Only public GitHub data is shown.
- Requests are unauthenticated in the current implementation.
- GitHub API rate limits can affect repeated searches.
- Repository analytics are based on the repositories returned by the current request.
- The contribution graph comes from `react-github-calendar`, which uses GitHub contribution data separately from the repository list used for the charts and table.

## Known Limitations

- The repository request currently fetches up to 100 repositories, so users with more than 100 public repositories will have incomplete analytics.
- The app does not currently cancel in-flight requests, so rapid username changes can lead to stale results briefly appearing.
- No automated test suite is included yet.
- The current production build creates a fairly large main JavaScript bundle.
- Search history is stored in Redux state but is not surfaced in the UI.
- The app currently focuses on a single dashboard route and does not yet offer profile comparison, exporting, or deeper filtering.

## Roadmap Ideas

- Add authenticated GitHub API support or a small backend proxy
- Paginate and aggregate all repositories instead of stopping at the first 100
- Add request cancellation and stale-response protection
- Add unit and integration tests
- Split large chart dependencies into smaller chunks
- Surface search history and recently viewed profiles in the UI
- Add richer repository analytics such as forks, activity trends, and repo age
- Support profile comparison between multiple developers

## Contributing

If you want to extend the project:

1. Fork the repository.
2. Create a feature branch.
3. Install dependencies with `npm install`.
4. Run the app locally with `npm run dev`.
5. Validate your changes with:
   - `npm run check`
   - `npm run lint`
   - `npm run build`
6. Open a pull request with a clear summary of your changes.

Good contribution areas include:

- improving API resilience
- adding tests
- improving performance
- expanding analytics depth
- polishing accessibility and mobile behavior

## License

This repository does not currently include a license file.

If you plan to publish it on GitHub for public reuse, adding a license such as MIT, Apache-2.0, or GPL will make the reuse terms clear for others.
