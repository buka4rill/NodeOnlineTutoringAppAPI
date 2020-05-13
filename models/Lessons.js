const mongoose = require('mongoose');

const LessonsSchema = mongoose.Schema({
    // PROPERTIES OF A TUTOR USER
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Lessons', LessonsSchema);