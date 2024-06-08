const db = require('./db');

const Review = {
    create: (review, callback) => {
        const sql = "INSERT INTO reviews (user_id, brewery_id, rating, description) VALUES (?, ?, ?, ?)";
        db.query(sql, [review.user_id, review.brewery_id, review.rating, review.description], callback);
    },
    findByUserId: (user_id, callback) => {
        const sql = "SELECT * FROM reviews WHERE user_id = ?";
        db.query(sql, [user_id], callback);
    }
};

module.exports = Review;
