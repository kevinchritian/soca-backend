const { eq, desc, and } = require('drizzle-orm');
const { db } = require('../database/db');
const { History } = require('../database/schema');
const response = require('../Utils/response');

const favorite = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perPage) || parseInt(process.env.PAGE_LIMIT);
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;

        const favorite = await db.select().from(History).where(and(eq(History.userId, req.user.id), eq(History.isFavorite, true))).orderBy(desc(History.updatedAt)).limit(perPage).offset(offset);
        const count = await db.select({ id: History.id }).from(History).where(and(eq(History.userId, req.user.id), eq(History.isFavorite, true))).orderBy(desc(History.updatedAt));
        const meta = {
            currentPage: page,
            perPage: perPage,
            totalData: count.length,
            totalPage: Math.ceil(count.length / perPage),
        };
        return response.success(res, 'Get favorite success', favorite, meta);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const addFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        const history = await db.query.History.findFirst({ where: and(eq(History.id, id), eq(History.userId, req.user.id)) });
        if (!history) {
            return response.error(res, 'Data not found');
        }

        await db.update(History).set({ isFavorite: true }).where(and(eq(History.id, id), eq(History.userId, req.user.id)));
        return response.success(res, 'Add favorite success');
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        const history = await db.query.History.findFirst({ where: and(eq(History.id, id), eq(History.userId, req.user.id)) });
        if (!history) {
            return response.error(res, 'Data not found');
        }
        history.isFavorite = false;
        await db.update(History).set({ isFavorite: false }).where(and(eq(History.id, id), eq(History.userId, req.user.id)));
        return response.success(res, 'Remove favorite success');
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const detailResult = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await db.query.History.findFirst({ where: and(eq(History.id, id), eq(History.userId, req.user.id)) });
        if (!history) {
            return response.error(res, 'Data not found');
        }
        return response.success(res, 'Get detail result success', history);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

module.exports = { favorite, addFavorite, removeFavorite, detailResult };