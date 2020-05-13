const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/tutorAuth');
const { check, validationResult } = require('express-validator');

// Include User Model
const TutorUser = require('../models/TutorUser');


// @route       GET /api/tutorAuth
// @desc        Get logged in tutor user
// @accees      Private
router.get('/', auth, async (req, res) => {
    // res.send('Get logged in student');

    try {
        // Get tutor user from db
        const tutorUser = await TutorUser.findById(req.tutorUser.id).select('-password');
        res.json(tutorUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       POST /api/tutorAuth
// @desc        Auth user tutor & get token (tutor logs in)
// @access      Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], 
    async (req, res) => {
        // res.send('Logged in as a tutor');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let tutorUser = await TutorUser.findOne({ email });

            // console.log(tutorUser);

            if (!tutorUser) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            // if Tutor, check the password
            const isMatch = await bcrypt.compare(password, tutorUser.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            // If Account is set to deactivated
            if (tutorUser.isActive == false) {
                return res.status(403).json({ msg: 'Account Deactivated!' });
            }


            // If match, send token
            const payload = {
                tutorUser: {
                    id: tutorUser.id
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
            res.status(500).send('Servor Error');
        }
    }
);


// Export 
module.exports = router;