const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    // PROPERTIES OF A TUTOR USER
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);