const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Review = require('../models/review');

exports.signup = (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { username, password: hashedPassword, email };

    User.create(user, (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).json({ message: 'Error signing up', error: err.message });
        }
        res.status(201).json({ message: 'User created successfully!' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, users) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Error logging in', error: err.message });
        }

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = users[0];
        const validPassword = bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
};



exports.getUserReviews = (req, res) => {
    const user_id = req.user.id;

    Review.findByUserId(user_id, (err, reviews) => {
        if (err) {
            console.error('Error fetching user reviews:', err);
            return res.status(500).json({ message: 'Error fetching user reviews', error: err.message });
        }
        res.json(reviews);
    });
};
