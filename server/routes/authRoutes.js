const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_FOLDER_PATH);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
// User registration
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const image = req.file ? req.file.filename : undefined;

        // Create the user with image
        const user = new User({ name, email, password, address, image, phone });
        await user.save();
        const token = user.generateAuthToken();

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            imageUrl: user.imageUrl, // Include the image URL
            token:  token
        };

        res.status(201).json({ userData });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((el) => el.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: err.message });
    }
});
// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            imageUrl: user.imageUrl, // Include the image URL
        };

        // Generate and return a JWT token
        const token = user.generateAuthToken();
        res.status(200).json({ token, userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
