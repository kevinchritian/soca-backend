const bcrypt = require('bcrypt');
const { connection, mssql } = require('../config/database');
const response = require('../Utils/response');
const { addTokenToBlacklist } = require('../middleware/blacklistToken');
const { secret, expiresIn } = require('../config/jwt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await connection();
        const result = await conn.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT * FROM users WHERE email = @email');
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const payload = {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                };
                const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
                const result = {
                    token: token,
                    tokenType: 'Bearer',
                    expiresIn: expiresIn,
                };

                response.success(res, 'User berhasil login', result);
            } else {
                response.error(res, 'Password salah');
            }
        } else {
            response.error(res, 'Email tidak ditemukan');
        }
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const conn = await connection();
        const result = await conn.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT * FROM users WHERE email = @email');
        if (result.recordset.length > 0) {
            response.error(res, 'Email sudah terdaftar');
        } else {
            const hash = await bcrypt.hash(password, 10);
            await conn.request()
                .input('fullName', mssql.VarChar, fullName)
                .input('email', mssql.VarChar, email)
                .input('password', mssql.VarChar, hash)
                .input('createdAt', mssql.DateTime, new Date())
                .query('INSERT INTO users (fullName, email, password, createdAt) VALUES (@fullName, @email, @password, @createdAt)');
            response.success(res, 'User berhasil terdaftar');
        }
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