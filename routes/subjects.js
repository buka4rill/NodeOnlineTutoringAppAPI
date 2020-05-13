const express = require('express');
const router = express.Router();



// @route       GET /api/subjects/:category/:id
// @desc        Get all users subjects by id
// @access      Private
router.get(':category/:id', (req, res) => {
    res.send('Get all subjects in category by id');
});


// @route       GET /api/subjects/:category
// @desc        Get all users subjects by category
// @access      Private
router.get('/:category', (req, res) => {
    res.send('Get all subjects by category');
});


// @route       POST /api/subjects
// @desc        Create subjects by Category
// @access      Private
router.post('/', (req, res) => {
    res.send('Create subjects');
});



// @route       PUT /api/subjects/:id
// @desc        Update subject in a category by id
// @access      Private
router.put('/:id', (req, res) => {
    res.send('Update subject');
});



// @route       DELETE /api/subjects/:id
// @desc        Delete subject in a category by id
// @access      Private 
router.delete('/:id', (req, res) => {
    res.send('Delete subject');
});



// Export
module.exports = router;
