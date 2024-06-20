const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const response = require('../Utils/response');
const { predict } = require('../controllers/prediction');
const authToken = require('../middleware/auth');
const uploadConfig = require('../middleware/uploadConfig');
const { history } = require('../controllers/history');
const { favorite, addFavorite, removeFavorite, detailResult } = require('../controllers/favorite');


router.get('/', (req, res) => {
  return response.success(res, 'Welcome to SOCA API');
});

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authToken, logout);

router.post('/predict', authToken, uploadConfig.single('image'), predict);

router.get('/history', authToken, history);
router.post('/favorite', authToken, addFavorite);
router.get('/favorite', authToken, favorite);
router.delete('/favorite', authToken, removeFavorite);
router.get('/history/:id', authToken, detailResult);

module.exports = router;