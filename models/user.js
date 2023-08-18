const mongoose = require('mongoose');

// Create the User schema
const userSchema = new mongoose.Schema({
    facebookId: {
        type: String,
        unique: true
    },
    name: String,
    email: {
        type: String,
        unique: true,
        sparse: true  // This makes email unique but allows multiple null values
    },
    profilePicture: String, // URL of the profile picture if needed
    // Add other fields as necessary
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
