const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const userController = {
    // User registration
    signup: async ({ username, email, password }) => {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists.');
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                username,
                email,
                password: hashedPassword,
            });

            const result = await user.save();
            return { ...result._doc, password: null, id: result.id };
        } catch (err) {
            throw err;
        }
    },

    // User login
    login: async ({ username, password }) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User does not exist.');
            }

            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect.');
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '1h' }
            );

            return { userId: user.id, token: token, tokenExpiration: 1 };
        } catch (err) {
            throw err;
        }
    },
};

module.exports = userController;
