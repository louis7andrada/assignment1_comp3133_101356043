const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Pre-save hook to hash password before saving a new user
userSchema.pre('save', function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        // Hash the password using our new salt
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return next(error);

            // Override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
});

// Method to check if the provided password matches the stored hashed password
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
