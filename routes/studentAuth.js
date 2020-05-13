const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/studentAuth');
const { check, validationResult } = require('express-validator');

// Include Student User Middleware
const StudentUser = require('../models/StudentUser');


// @route       GET /api/studentAuth
// @desc        Get logged in student user
// @accees      Private
router.get('/', auth, async (req, res) => {
    // res.send('Get logged in student');

    try {
        // Get student user from db
        const studentUser = await StudentUser.findById(req.studentUser.id).select('-password');
        res.json(studentUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       POST /api/studentAuth
// @desc        Auth user student & get token (student logs in)
// @access      Public
router.post(
    '/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        // res.send('Log in student');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let studentUser = await StudentUser.findOne({ email });

            if (!studentUser) {
                return res.status(400).json({ msg: 'Invalid Credentials'});
            } 

            // If there's a user, chech password
            const isMatch = await bcrypt.compare(password, studentUser.password);

            if (!isMatch) {
                return res.status(400).json({msg: 'Invalid Credentials'});
            }

            // If it matches, send token
            const payload = {
                studentUser: {
                    id: studentUser.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
);


// Export 
module.exports = router;
