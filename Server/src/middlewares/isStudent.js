module.exports = async (req, res, next) => {
    try {
        if (req.user.role !== 'user') {
            throw new Error('Unauthorized');
        }
        return next();
    } catch (e) {
        return res.status(403).json({ message: e.message });
    }
};
