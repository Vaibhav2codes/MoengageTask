const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/reviews/user', authenticate, userController.getUserReviews);


module.exports = router;
