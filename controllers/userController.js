// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../models/db');
// const User = require('../models/userModel');

// exports.signup = async (req, res) => {
//     const { username, password, email } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
//         db.query(sql, [username, hashedPassword, email], (err, result) => {
//             if (err) return res.status(500).json({ message: 'Error signing up', error: err });
//             res.status(201).json({ message: 'User created successfully' });
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// exports.login = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const sql = 'SELECT * FROM users WHERE username = ?';
//         db.query(sql, [username], async (err, results) => {
//             if (err) return res.status(500).json({ message: 'Error logging in', error: err });
//             if (results.length === 0) return res.status(401).json({ message: 'User not found' });

//             const user = results[0];
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//             const token = jwt.sign({ id: user.id, username: user.username }, 'secretkey', { expiresIn: '1h' });
//             res.status(200).json({ message: 'Login successful', token });
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


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
