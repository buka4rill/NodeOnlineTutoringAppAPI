const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/tutorAuth');
const { check, validationResult } = require('express-validator');

// @route       GET /api/subjects/:category
// @desc        User gets all category
// @access      Private
router.get('/', (req, res) => {
    res.send('Get all categories');
});


// Export
module.exports = router;