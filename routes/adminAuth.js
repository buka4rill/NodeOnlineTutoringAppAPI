const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

// Include tutor and Admin model
const TutorUser = require('../models/TutorUser');
const AdminUser = require('../models/AdminUser');

// @route       GET /api/adminAuth
// @desc        Get logged in admin tutor
// @accees      Private
router.get('/', auth, async (req, res) => {
    // res.send('Get logged in admin');
    try {
        const adminUser = await AdminUser.findById(req.adminUser.id).select('-password');
        res.json(adminUser);
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       POST /api/adminAuth
// @desc        Auth user admin & get token (admin logs in)
// @access      Public
router.post('/', 
    [
        check('adminId', 'Admin ID is required!').not().isEmpty(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { adminId, password } = req.body;

        try {
            let adminUser = await AdminUser.findOne({ adminId });

            if (!adminUser) {
                return res.status(400).json({ msg: 'Invalid Admin Id' });
            }

            const isMatch = await bcrypt.compare(password, adminUser.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Password' });
            }

            // If match 
            const payload = {
                adminUser: {
                    id: adminUser.id
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