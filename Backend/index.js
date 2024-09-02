// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/auth');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentdb'; // Add your MongoDB URI to .env

app.use(bodyParser.json());
app.use(cors());
app.use('/students', authenticate, studentRoutes); // Protect student routes
app.use('/auth', authRoutes); // Public auth routes

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });
