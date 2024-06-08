const axios = require('axios');
const db = require('../models/db');
const Brewery = require('../models/brewery');
const Review = require('../models/review');

exports.searchBreweries = async (req, res) => {
    const { by_city, by_name, by_type } = req.query;
    let url = 'https://api.openbrewerydb.org/breweries';

    const params = [];
    if (by_city) params.push(`by_city=${by_city}`);
    if (by_name) params.push(`by_name=${by_name}`);
    if (by_type) params.push(`by_type=${by_type}`);

    if (params.length) url += '?' + params.join('&');

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching breweries:', error);
        res.status(500).json({ message: 'Error fetching breweries', error: error.message });
    }
};

exports.getBreweryDetails = (req, res) => {
    const brewery_id = req.params.id;
    const sql = 'SELECT * FROM reviews WHERE brewery_id = ?';
    db.query(sql, [brewery_id], (err, reviews) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ message: 'Error fetching reviews', error: err.message });
        }
        axios.get(`https://api.openbrewerydb.org/breweries/${brewery_id}`)
            .then(response => {
                const brewery = response.data;
                brewery.reviews = reviews;
                res.json(brewery);
            })
            .catch(error => {
                console.error('Error fetching brewery details:', error);
                res.status(500).json({ message: 'Error fetching brewery details', error: error.message });
            });
    });
};

exports.getBreweryPage = async (req, res) => {
    try {
       
        const breweryId = req.params.breweryId;
        const breweryResponse = await axios.get(`https://api.openbrewerydb.org/breweries/${breweryId}`);
        const brewery = breweryResponse.data;

        
        const existingReviews = await Review.find({ breweryId: breweryId });

        res.render('brewery', { brewery: brewery, reviews: existingReviews });
    } catch (error) {
        console.error('Error fetching brewery details:', error.message);
        res.status(500).send('Error fetching brewery details');
    }
};

exports.addReview = (req, res) => {
    const { brewery_id, rating, description } = req.body;
    const user_id = req.user.id;

    const review = { user_id, brewery_id, rating, description };

    Review.create(review, (err, result) => {
        if (err) {
            console.error('Error adding review:', err);
            return res.status(500).json({ message: 'Error adding review', error: err.message });
        }
        res.status(201).json({ message: 'Review added successfully!' });
    });
};
