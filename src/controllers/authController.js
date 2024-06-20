const bcrypt = require('bcrypt');
const response = require('../Utils/response');
const { addTokenToBlacklist } = require('../middleware/blacklistToken');
const { secret, expiresIn } = require('../config/jwt');
const jwt = require('jsonwebtoken');
const { db } = require('../database/db');
const { User } = require('../database/schema');
const { eq } = require('drizzle-orm');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.query.User.findFirst({ where: eq(User.email, email) });
        if (!user) {
            return response.error(res, 'Email tidak ditemukan');
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return response.error(res, 'Password salah');
        }

        const payload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        }
        const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
        const result = {
            token: token,
            tokenType: 'Bearer',
            expiresIn: parseInt(expiresIn),
        }

        return response.success(res, 'User berhasil login', result);
    } catch (error) {
        return response.internalError(res, error.message);
    }
};

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const user = await db.query.User.findFirst({ where: eq(User.email, email) });
        if (user) {
            return response.error(res, 'Email sudah terdaftar');
        }

        const hash = await bcrypt.hash(password, 10);
        await db.insert(User).values({ fullName: fullName, email: email, password: hash });

        return response.success(res, 'User berhasil terdaftar');
    } catch (error) {
        response.internalError(res, error.message);
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        addTokenToBlacklist(token);

        response.success(res, 'Keluar berhasil');
    } catch (error) {
        response.internalError(res, error.message);
    }
};

module.exports = { login, register, logout };