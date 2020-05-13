const mongoose = require('mongoose');

const AdminUserSchema = mongoose.Schema({
    // PROPERTIES OF A TUTOR USER
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'isAdmin'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);