const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4: uuid} = 'uuid';
const config = require('config');
// const auth = require('../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

// Include Student User model
const TutorUser = require('../models/TutorUser');
const AdminUser = require('../models/AdminUser');

// @route       POST /api/users/tutors
// @desc        Register tutors user
// @accees      Public
router.post(
    '/', 
    [
        check('name', 'Please add name')
            .not()
            .isEmpty(),
        check('email', 'Please add a valid email').isEmail(),
        check('password', 'Please enter a valid password with 6 or more characters')
            .isLength({ min: 6 }),
    ], 
    async (req, res) => {
        // res.send('Student registered!');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, isAdmin, isActive } = req.body;

        try {
            // Check to see if there's a user with particular email
            let tutorUser = await TutorUser.findOne({ email });

            if (tutorUser) {
                return res.status(400).json({ msg: 'This tutor exists already!'});
            }

            tutorUser = new TutorUser({
                name,
                email,
                password,
                isAdmin,
                isActive
            });

            // Encrypt password with bcrypt
            const salt = await bcrypt.genSalt(10);

            tutorUser.password = await bcrypt.hash(password, salt);

            await tutorUser.save();

            // Send response
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
            res.status(500).send('Server Error');
        }
    }
);




// Export
module.exports = router;
