const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'todo-manager'; // replace with your actual repo name

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isGitHubPages ? `/${repoName}/` : '',
  basePath: isGitHubPages ? `/${repoName}` : '',
};

module.exports = nextConfig;