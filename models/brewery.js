const db = require('./db');

const Brewery = {
    findById: (id, callback) => {
        const sql = "SELECT * FROM breweries WHERE id = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Brewery;