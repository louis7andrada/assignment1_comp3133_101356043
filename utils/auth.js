const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1]; // Authorization: Bearer token
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};

// Function to generate a new JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        {
            userId: userId,
            email: email
        },
        process.env.JWT_SECRET || 'your_secret_key_here',
        { expiresIn: '1h' }
    );
};

module.exports = { isAuthenticated, generateToken };
