const { eq, desc } = require('drizzle-orm');
const { db } = require('../database/db');
const { History } = require('../database/schema');
const response = require('../Utils/response');

const history = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perPage) || parseInt(process.env.PAGE_LIMIT);
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;

        const histories = await db.select().from(History).where(eq(History.userId, req.user.id)).orderBy(desc(History.updatedAt)).limit(perPage).offset(offset);
        const count = await db.select({ id: History.id }).from(History).where(eq(History.userId, req.user.id));
        const meta = {
            currentPage: page,
            perPage: perPage,
            totalData: count.length,
            totalPage: Math.ceil(count.length / perPage),
        };
        return response.success(res, 'Get history success', histories, meta);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

module.exports = { history };