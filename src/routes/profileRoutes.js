const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { analyzeProfile, getAllProfiles, getSingleProfile } = require('../controllers/profileController');
const validate = require('../middleware/validate');

const usernameValidation = [
  param('username')
    .trim()
    .notEmpty().withMessage('Username cannot be empty')
    .isLength({ min: 1, max: 39 }).withMessage('Username must be between 1 and 39 characters')
    .matches(/^[a-zA-Z0-9-]+$/).withMessage('Username can only contain letters, numbers, and hyphens'),
  validate
];

router.post('/analyze/:username', usernameValidation, analyzeProfile);
router.get('/profiles', getAllProfiles);
router.get('/profiles/:username', usernameValidation, getSingleProfile);

module.exports = router;