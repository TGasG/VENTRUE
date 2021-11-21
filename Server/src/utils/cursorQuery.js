const cursorQuery = (page, res, limit = 6) => {
    // Cursor-based pagination
    const query = {
        take: Math.abs(limit),
    };

    if (page) {
        if (page.before && page.after) {
            return res.status(400).json({
                message: 'Only one page query is allowed.',
            });
        } else if (page.before) {
            query.take = -Math.abs(limit);
            query.cursor = {
                id: parseInt(page.before),
            };
            query.skip = 1;
        } else if (page.after) {
            query.take = Math.abs(limit);
            query.cursor = {
                id: parseInt(page.after),
            };
            query.skip = 1;
        }
    }

    return query;
};

module.exports = cursorQuery;
