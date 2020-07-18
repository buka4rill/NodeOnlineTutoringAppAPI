const express = require('express');
const router = express.Router();
// const config = require('config');
const auth = require('../middleware/AdminAuth');
const { check, validationResult } = require('express-validator');

const Category = require('../models/Category');
const AdminUser = require('../models/AdminUser');

// @route       GET /api/category
// @desc        User gets all category
// @access      Private
router.get('/', auth, async (req, res) => {
    // Get categories from db
    try {
        const category = await Category.findById(req.category.id).sort({ date: -1 });

        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST /api/category
// @desc        Admin creates category
// @access      Private
router.post(
    '/',
    [ auth,
        [
            check('name', 'Name of category is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        // Check for errors
        const errors = validationResult(req);

        let adminUser = AdminUser.findById(req.adminUser.id)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // if
        
        const { name, description } = req.body;

        if (req.adminUser === undefined) {
            return res.status(401).json({ msg: 'Unauthorised user' });
        } 

        try {

            const newCategory = await Category({
                name, 
                description
            });

            // Put category in db
            const category = await newCategory.save();

            res.json(category);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// Export
module.exports = router;