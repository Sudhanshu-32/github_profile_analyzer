# GitHub Profile Analyzer API

A REST API built with Node.js, Express, and MySQL that analyzes GitHub user profiles and stores insights using the GitHub Public API.

---

## Tech Stack
- Node.js
- Express.js
- MySQL
- GitHub REST API
- axios, dotenv, cors, express-validator

---

## Setup Instructions

### 1. Clone the repository
git clone <your-repo-url>
cd github-analyzer

### 2. Install dependencies
npm install

### 3. Configure environment variables
Create a `.env` file in the root directory:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_analyzer
GITHUB_TOKEN=your_github_token

### 4. Set up the database
Log into MySQL and run:

CREATE DATABASE github_analyzer;
USE github_analyzer;

CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150),
  bio TEXT,
  avatar_url VARCHAR(255),
  location VARCHAR(150),
  blog VARCHAR(255),
  public_repos INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  top_language VARCHAR(100),
  profile_url VARCHAR(255),
  account_created_at DATETIME,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

### 5. Run the server
npm run dev

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| POST | /api/analyze/:username | Fetch & store GitHub profile |
| GET | /api/profiles | Get all analyzed profiles |
| GET | /api/profiles/:username | Get single profile by username |

---

## API Examples

### Analyze a profile
POST /api/analyze/torvalds

Response:
{
  "success": true,
  "message": "Profile analyzed and saved",
  "data": { ... }
}

### Get all profiles
GET /api/profiles
GET /api/profiles?page=1&limit=5

### Get single profile
GET /api/profiles/torvalds

---

## Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto increment primary key |
| username | VARCHAR(100) | GitHub username (unique) |
| name | VARCHAR(150) | Display name |
| bio | TEXT | Profile bio |
| avatar_url | VARCHAR(255) | Profile picture URL |
| location | VARCHAR(150) | User location |
| blog | VARCHAR(255) | Website/blog URL |
| public_repos | INT | Number of public repositories |
| followers | INT | Follower count |
| following | INT | Following count |
| top_language | VARCHAR(100) | Most used programming language |
| profile_url | VARCHAR(255) | GitHub profile URL |
| account_created_at | DATETIME | GitHub account creation date |
| analyzed_at | TIMESTAMP | Last analyzed timestamp |