const axios = require('axios');
require('dotenv').config();

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    })
  }
});

const getTopLanguage = async (username) => {
  try {
    const { data: repos } = await githubAPI.get(`/users/${username}/repos`, {
      params: { per_page: 100 }
    });

    const langCount = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    return Object.keys(langCount).sort((a, b) => langCount[b] - langCount[a])[0] || null;
  } catch {
    return null;
  }
};

const fetchGitHubProfile = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}`);

    const topLanguage = await getTopLanguage(username);

    return {
      username: data.login,
      name: data.name || null,
      bio: data.bio || null,
      avatar_url: data.avatar_url || null,
      location: data.location || null,
      blog: data.blog || null,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      top_language: topLanguage,
      profile_url: data.html_url,
      account_created_at: new Date(data.created_at)
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('GitHub user not found');
    }
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw new Error('Failed to fetch GitHub profile');
  }
};

module.exports = { fetchGitHubProfile };