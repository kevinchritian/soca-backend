const response = (res, status, message, data, meta) => {
    const defaultResponse = {
        status: status,
        message: message,
        data: data || null,
    }
    if (meta) {
        defaultResponse.meta = meta;
    }
    res.status(status).json(defaultResponse);
}

const success = (res, message, data, meta) => {
    response(res, 200, message, data, meta);
};

const error = (res, message, data) => {
    response(res, 400, message, data);
};

const unauthorized = (res, message, data) => {
    response(res, 401, message, data);
}

const internalError = (res, message, data) => {
    response(res, 500, message, data);
};

module.exports = { success, error, unauthorized, internalError }