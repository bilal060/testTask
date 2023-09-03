const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
});
userSchema.virtual('imageUrl').get(function () {
    return `${process.env.SERVER_URL}/uploads/${this.image}`;
});

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});
// userSchema.pre('findOneAndUpdate', async function (next) {
//     const user = this;
//     user.password = await bcrypt.hash(user.password, 8);
// console.log(user)
//
//     next();
// });

// Generate a JWT token for the user
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
    return token;
};

module.exports = mongoose.model('User', userSchema);
