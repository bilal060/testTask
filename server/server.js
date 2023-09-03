const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 4000;

const cors = require('cors');
app.use(cors({
    origin: '*'
}));
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes); // Apply authMiddleware to user routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
