import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repository name from environment variables
// Priority: REPO_NAME env var > GITHUB_REPOSITORY > default 'fracture-app'
// If your repo has a different name, set REPO_NAME when building:
// REPO_NAME=your-repo-name npm run build:gh-pages
const repoName = process.env.REPO_NAME || 
                 process.env.GITHUB_REPOSITORY?.split('/')[1] || 
                 'fracture-app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use repository name as base path for GitHub Pages, '/' for local dev
  base: process.env.GITHUB_PAGES ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
