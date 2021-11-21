const express = require('express');
const router = express.Router();
const prisma = require('../../config/prismaClient');
const { validateEvent } = require('../../config/joi');
const auth = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');
const createCursor = require('../../utils/cursorQuery');
// Auth Middleware
router.use(auth);

// isAdmin Middleware
router.use(isAdmin);

router.get('/', async (req, res) => {
    const { name, page } = req.query;
    const where = {};
    if (name) {
        where.OR = [
            {
                name: {
                    contains: name,
                },
            },
            {
                organization: {
                    is: {
                        user: {
                            is: {
                                name: {
                                    contains: name,
                                },
                            },
                        },
                    },
                },
            },
            {
                categories: {
                    some: {
                        name: {
                            contains: name,
                        },
                    },
                },
            },
        ];
    }

    // Cursor-based pagination
    const cursorQuery = createCursor(page, res, 12);

    try {
        const events = await prisma.event.findMany({
            ...cursorQuery,
            where: {
                ...where,
            },
            include: {
                organization: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                categories: true,
            },
        });

        if (events.length === 0) {
            return res.status(404).json({
                message: 'No events found',
            });
        }
        const nextCursor = events[events.length - 1].id || null;
        const previousCursor = page ? events[0].id : null;
        return res.json({
            message: 'Events retrieved',
            data: events,
            next_cursor: nextCursor,
            previous_cursor: previousCursor,
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Event cannot be retrieved',
        });
    }
});

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            const result = await prisma.event.findUnique({
                where: {
                    id: parseInt(req.params.id),
                },
                include: {
                    organization: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    categories: true,
                    images: true,
                    cover: {
                        include: {
                            image: true,
                        },
                    },
                    _count: {
                        select: {
                            registers: true,
                            views: true,
                        },
                    },
                },
            });

            if (!result) {
                return res.status(404).json({
                    message: 'Event not found',
                });
            }

            return res.json({
                message: 'Event retrieved',
                data: result,
            });
        } catch (e) {
            return res.status(400).json({
                message: 'Event cannot be retrieved',
            });
        }
    })
    .put(async (req, res) => {
        const [data, validationError] = await validateEvent({
            name: req.body.name,
            description: req.body.description,
            time: req.body.time,
            price: req.body.price,
            categories: req.body.categories,
            registerEnd: req.body.registerEnd || req.body.time,
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError.details[0].message,
            });
        }

        const foundEvent = await prisma.event.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (!foundEvent) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        try {
            const result = await prisma.event.update({
                where: {
                    id: foundEvent.id,
                },
                data: {
                    name: data.name,
                    description: data.description,
                    time: data.time,
                    price: data.price,
                    registerEnd: data.registerEnd,
                    categories: {
                        deleteMany: {
                            NOT: data.categories.map((id) => ({
                                id,
                            })),
                        },
                        connect: data.categories.map((id) => ({
                            id,
                        })),
                    },
                },
                include: {
                    organization: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    categories: true,
                },
            });

            return res.json({
                message: 'Event updated',
                data: result,
            });
        } catch (e) {
            return res.status(400).json({
                message: 'Event update failed',
            });
        }
    })
    .delete(async (req, res) => {
        try {
            const foundEvent = await prisma.event.findUnique({
                where: {
                    id: parseInt(req.params.id),
                },
                select: {
                    organizationId: true,
                },
            });

            if (!foundEvent)
                return res.status(404).json({
                    message: 'Event not found',
                });

            const result = await prisma.event.delete({
                where: {
                    id: parseInt(req.params.id),
                },
                include: {
                    organization: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    categories: true,
                    images: true,
                    cover: true,
                },
            });

            return res.json({
                message: 'Event deleted',
                data: result,
            });
        } catch (e) {
            return res.status(400).json({
                message:
                    'Event delete failed. Check if the event belongs to your organization',
            });
        }
    });

module.exports = router;
