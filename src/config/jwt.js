module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.TOKEN_EXPIRATION,
};