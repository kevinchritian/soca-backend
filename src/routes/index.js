const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { connection } = require('../config/database');
const response = require('../Utils/response');
const { predict } = require('../controllers/prediction');
const authToken = require('../middleware/auth');
const uploadConfig = require('../middleware/uploadConfig');
const { history } = require('../controllers/history');
const { favorite, addFavorite, removeFavorite, detailResult } = require('../controllers/favorite');


router.get('/', (req, res) => {
  connection()
    .then(() => {
      response.success(res, 'Welcome to SOCA API');
    })
    .catch(error => {
      response.internalError(res, error.message);
    });
});

router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/logout', authToken, auth.logout);

router.post('/predict', authToken, uploadConfig.single('image'), predict);

router.get('/history', authToken, history);
router.post('/favorite', authToken, addFavorite);
router.get('/favorite', authToken, favorite);
router.delete('/favorite', authToken, removeFavorite);
router.get('/history/:id', authToken, detailResult);

module.exports = router;