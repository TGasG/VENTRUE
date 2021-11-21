const prisma = require('../config/prismaClient');

const isEventOwner = async (req, res, next) => {
    try {
        const foundEvent = await prisma.event.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (!foundEvent)
            return res.status(404).json({
                message: 'Event not found',
            });

        if (foundEvent.organizationId !== parseInt(req.user.organization.id))
            return res.status(403).json({
                message: 'You are not the owner of the event',
            });

        next();
    } catch (e) {
        return res.status(400).json({
            message: 'Something wrong with your request',
        });
    }
};

module.exports = isEventOwner;
