const db = require('./db');

const User = {
    create: (user, callback) => {
        const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        db.query(sql, [user.username, user.password, user.email], callback);
    },
    findByUsername: (username, callback) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], callback);
    }
};

module.exports = User;
