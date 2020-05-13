const express = require('express');
const connectDB = require('./config/db');

// Connect Database
connectDB();

// Initialise express
const app = express();


// Initialise Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: 'Hello world!'}));


// Define Routes
app.use('/api/users/students', require('./routes/studentUsers'));
app.use('/api/users/tutors', require('./routes/tutorUsers'));
app.use('/api/users/admin', require('./routes/adminUsers'));
app.use('/api/studentAuth', require('./routes/studentAuth'));
app.use('/api/tutorAuth', require('./routes/tutorAuth'));
app.use('/api/adminAuth', require('./routes/adminAuth'));
app.use('/api/category', require('./routes/category'));
app.use('/api/subjects', require('./routes/subjects'));




const PORT = process.env.PORT || 9005;

// Listen
app.listen(PORT, () => console.log(`Server started on ${PORT}`));