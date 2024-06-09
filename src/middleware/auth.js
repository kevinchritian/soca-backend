const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { isTokenBlacklisted } = require('./blacklistToken');
const response = require('../Utils/response');

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.unauthorized(res, 'Unauthorized');
    }

    if (isTokenBlacklisted(token)) {
        return response.unauthorized(res, 'Token has been revoked');
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return response.unauthorized(res, 'Unauthorized');
        }
        req.user = user;
        next();
    });
}

module.exports = auth;