const { connection, mssql } = require('../config/database');
const response = require('../Utils/response');

const history = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perPage) || parseInt(process.env.PAGE_LIMIT);
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;

        const conn = await connection();
        const result = await conn.request()
            .input('perPage', mssql.Int, perPage)
            .input('offset', mssql.Int, offset)
            .input('userId', mssql.Int, req.user.id)
            .query('SELECT * FROM history WHERE userId = @userId ORDER BY createdAt DESC OFFSET @offset ROWS FETCH NEXT @perPage ROWS ONLY');

        const count = await conn.request()
            .input('userId', mssql.Int, req.user.id)
            .query('SELECT COUNT(*) AS total FROM history WHERE userId = @userId');

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

module.exports = { history };