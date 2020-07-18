const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/adminAuth');
const config = require('config');
const { check, validationResult } = require('express-validator');


// Admin user model
const AdminUser = require('../models/AdminUser');
const TutorUser = require('../models/TutorUser');


// @route       POST api/users/admin
// @desc        Register an admin based on if tutor has tutorId
// @accees      Public
router.post(
    '/', 
    [
        check('adminId', 'Admin ID is required to register as admin')
            .not()
            .isEmpty(),
        check('email', 'Please add a valid email').isEmail(),
        check('password', 'Please enter a valid password with 6 or more characters')
            .isLength({ min: 6 }),
    ], 
    async (req, res) => {
        // res.send('Admin registered!');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { adminId, email, password } = req.body;

        try {
            // Check to see if there's a user with particular email
            let adminUser = await AdminUser.findOne({ email });

            if (adminUser) {
                return res.status(400).json({ msg: 'This admin exists already!'});
            }

            adminUser = new AdminUser({
                adminId,
                email,
                password
            });

            // Encrypt password with bcrypt
            const salt = await bcrypt.genSalt(10);

            adminUser.password = await bcrypt.hash(password, salt);

            await adminUser.save();

            // Send response
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
            res.status(500).send('Server Error');
        }
    }
);


// @route       GET api/users/admin/tutors
// @desc        Super admin gets all tutors
// @accees      Private
router.get('/tutors', auth, async (req, res) => {
    try {
        // Pull from database 
        // const adminUser = await AdminUser.findById(req.adminUser.id).select('-password');
        const adminUser = await AdminUser.findById(req.adminUser.id).select('-password');

        if (adminUser) {
            // Find tutors admin
            const tutorUsers = await TutorUser.find({ tutorUser: req.tutorUser });
        
            res.json(tutorUsers);
        } else {
            // Unauthorised
            return res.status(401).json({ msg: 'Not authorized' });
        }


        // Find tutors admin
        // const tutorUsers = await TutorUser.find({ tutorUser: req.tutorUser });

        // res.json(tutorUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       GET api/users/admin/tutors
// @desc        Super admin gets tutors by id
// @accees      Private
router.get('/tutors/:id', auth, async (req, res) => {
    try {
        // Pull from database 

        const adminUser = await AdminUser.findById(req.adminUser.id).select('-password');

        if (adminUser) {
            // Find tutors admin
            const tutorUsers = await TutorUser.findById(req.params.id);

            res.json(tutorUsers);
        } else {
            // Unauthorised
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/users/admin/tutors
// @desc        Super admin deactivates Tutor
// @accees      Private
router.put('/tutors/:id', auth, async (req, res) => {
    try {

        const adminUser = await AdminUser.findById(req.adminUser.id).select('-password');
        console.log(adminUser);
        console.log(auth)
        
        if (adminUser) {
            // Find tutors admin
            let tutorUser = await TutorUser.findById(req.params.id);

            if (!tutorUser) return res.status(404).json({ msg: 'Tutor not found' });

            let { isAdmin, isActive } = req.body;

            let tutorFields = {};
        
            // Activate or Deactivate Tutor
            if (isActive) {
                tutorFields.isActive = isActive;
            }

            // Set Admin status
            if (isAdmin) {
                tutorFields.isAdmin = isAdmin;
            }
        
            // Update tutor status
            tutorUser = await TutorUser.findByIdAndUpdate(req.params.id,
                { $set: tutorFields },
                { new: true }  
            );

            
            res.json(tutorUser);
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Export
module.exports = router;