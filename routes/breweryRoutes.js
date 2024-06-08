const express = require('express');
const router = express.Router();
const breweryController = require('../controllers/breweryController');
const authenticate = require('../middleware/authenticate');

router.get('/search', breweryController.searchBreweries);
router.get('/:id', breweryController.getBreweryDetails);
router.post('/reviews', authenticate, breweryController.addReview);
// router.get('/:breweryId', breweryController.getBreweryPage);


module.exports = router;
