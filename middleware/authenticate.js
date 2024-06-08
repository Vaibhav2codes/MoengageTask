const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
        console.log('No auth header');
        return res.status(401).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
        console.log('No token');
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        console.log('Decoded:', decoded);
        req.user = decoded;
        next();
    } catch (ex) {
        console.log('Invalid token');
        res.status(400).send('Invalid token.');
    }
};

module.exports = authenticate;
