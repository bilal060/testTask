const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_FOLDER_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Authorization middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret key
        req.userData = { userId: decodedToken._id };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }
};

// Create a new user
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const user = new User({ name, email, password, address, image });
        await user.save();
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            image: user.imageUrl, // Include the image URL
        };

        res.status(201).json(userData);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((el) => el.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Read all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const users = await User.findById({_id: new Object( req.userData.userId)});

        const userData = {
            _id: users._id,
            name: users.name,
            email: users.email,
            address: users.address,
            phone: users.phone,
            image: users.imageUrl, // Include the image URL
        };

        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user (requires authentication and authorization)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        // Check if the user is updating their own account
        if (req.params.id !== req.userData.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this user.' });
        }

        const { name, password, address, phone } = req.body;
        const image = req.file ? req.file.filename : undefined;
        let passwordhashed = null
        let updatedUser = null
        if(password){
            passwordhashed = await bcrypt.hash(password, 8);
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { name, password:passwordhashed, address, image, phone },
                { new: true, runValidators: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { name, address, image, phone },
                { new: true, runValidators: true }
            );
        }

        const userData = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            image: updatedUser.imageUrl, // Include the image URL
        };

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(userData);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((el) => el.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete a user (requires authentication and authorization)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Check if the user is deleting their own account
        if (req.params.id !== req.userData.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this user.' });
        }

        const deletedUser = await User.findByIdAndRemove(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
