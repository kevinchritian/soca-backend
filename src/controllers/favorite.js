const { connection, mssql } = require('../config/database');
const response = require('../Utils/response');

const favorite = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perPage) || parseInt(process.env.PAGE_LIMIT);
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;

        const conn = await connection();
        const result = await conn.request()
            .input('perPage', mssql.Int, perPage)
            .input('offset', mssql.Int, offset)
            .input('userId', mssql.Int, req.user.id)
            .input('isFavorite', mssql.Bit, true)
            .query('SELECT * FROM history WHERE userId = @userId AND isFavorite = @isFavorite ORDER BY createdAt DESC OFFSET @offset ROWS FETCH NEXT @perPage ROWS ONLY');

        const count = await conn.request()
            .input('userId', mssql.Int, req.user.id)
            .query('SELECT COUNT(*) AS total FROM history WHERE userId = @userId AND isFavorite = 1');

        const meta = {
            currentPage: page,
            perPage: perPage,
            totalData: count.recordset[0].total,
            totalPage: Math.ceil(count.recordset[0].total / perPage),
        };
        response.success(res, 'Get history success', result.recordset, meta);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const addFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        const conn = await connection();
        await conn.request()
            .input('id', mssql.Int, id)
            .input('userId', mssql.Int, req.user.id)
            .query('UPDATE history SET isFavorite = 1 WHERE id = @id AND userId = @userId');
        response.success(res, 'Add favorite success');
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        const conn = await connection();
        await conn.request()
            .input('id', mssql.Int, id)
            .input('userId', mssql.Int, req.user.id)
            .query('UPDATE history SET isFavorite = 0 WHERE id = @id AND userId = @userId');
        response.success(res, 'Remove favorite success');
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const detailResult = async (req, res) => {
    try {
        const { id } = req.params;
        const conn = await connection();
        const result = await conn.request()
            .input('id', mssql.Int, id)
            .input('userId', mssql.Int, req.user.id)
            .query('SELECT * FROM history WHERE id = @id AND userId = @userId');
        if (result.recordset.length > 0) {
            response.success(res, 'Get detail result success', result.recordset[0]);
        } else {
            response.error(res, 'Data not found', 404);
        }
    } catch (error) {
        response.internalError(res, error.message);
    }
};

module.exports = { favorite, addFavorite, removeFavorite, detailResult };