const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    // PROPERTIES OF A TUTOR USER
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Category', CategorySchema);