const { pool } = require('../config/db');
const { fetchGitHubProfile } = require('../services/githubService');

const analyzeProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const profileData = await fetchGitHubProfile(username);

    const [existing] = await pool.query(
      'SELECT id FROM profiles WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE profiles SET name=?, bio=?, avatar_url=?, location=?, blog=?,
        public_repos=?, followers=?, following=?, top_language=?,
        profile_url=?, account_created_at=?, analyzed_at=NOW()
        WHERE username=?`,
        [
          profileData.name,
          profileData.bio,
          profileData.avatar_url,
          profileData.location,
          profileData.blog,
          profileData.public_repos,
          profileData.followers,
          profileData.following,
          profileData.top_language,
          profileData.profile_url,
          profileData.account_created_at,
          username
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO profiles (username, name, bio, avatar_url, location, blog,
        public_repos, followers, following, top_language, profile_url, account_created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileData.username,
          profileData.name,
          profileData.bio,
          profileData.avatar_url,
          profileData.location,
          profileData.blog,
          profileData.public_repos,
          profileData.followers,
          profileData.following,
          profileData.top_language,
          profileData.profile_url,
          profileData.account_created_at
        ]
      );
    }

    const [rows] = await pool.query(
      'SELECT * FROM profiles WHERE username = ?',
      [username]
    );

    res.status(200).json({
      success: true,
      message: existing.length > 0 ? 'Profile updated' : 'Profile analyzed and saved',
      data: rows[0]
    });

  } catch (error) {
    res.status(error.message === 'GitHub user not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};
const getAllProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      'SELECT * FROM profiles ORDER BY analyzed_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM profiles'
    );

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getSingleProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM profiles WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Profile for "${username}" not found. Use POST /api/analyze/${username} first.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = { analyzeProfile, getAllProfiles, getSingleProfile };