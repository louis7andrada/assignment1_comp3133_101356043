// To connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('MongoDB connected successfully.');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
});

// To access the port number for the server
const PORT = process.env.PORT || 3000;

// To sign a JWT token
const jwt = require('jsonwebtoken');

const token = jwt.sign({ data: 'payload' }, process.env.JWT_SECRET, {
    expiresIn: '1h'
});
