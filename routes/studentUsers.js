const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Include Student User model
const StudentUser = require('../models/StudentUser');


// @route       POST /api/users/studentUsers
// @desc        Register a student user
// @accees      Public
router.post(
    '/', 
    [
        check('name', 'Please add name')
            .not()
            .isEmpty(),
        check('email', 'Please add a valid email').isEmail(),
        check('password', 'Please enter a valid password with 6 or more characters')
            .isLength({ min: 6 })
    ], 
    async (req, res) => {
        // res.send('Student registered!');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check to see if there's a user with particular email
            let studentUser = await StudentUser.findOne({ email });

            if (studentUser) {
                return res.status(400).json({ msg: 'This student exists already!'});
            }

            studentUser = new StudentUser({
                name,
                email,
                password
            });

            // Encrypt password with bcrypt
            const salt = await bcrypt.genSalt(10);

            studentUser.password = await bcrypt.hash(password, salt);

            await studentUser.save();

            // Send response
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