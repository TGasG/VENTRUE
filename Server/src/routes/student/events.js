const express = require('express');
const router = express.Router();
const prisma = require('../../config/prismaClient');
const auth = require('../../middlewares/auth');
const isStudent = require('../../middlewares/isStudent');
const createCursor = require('../../utils/cursorQuery');
// TODO : Add cover image to every GET response
// Auth Middleware
router.use(auth);

// isStudent Middleware
router.use(isStudent);

// Request : Get events with additional name,category, and upcoming filter.
router.route('/').get(async (req, res) => {
    const { name, category, upcoming, page } = req.query;
    const where = {};
    if (name) {
        where.name = {
            contains: name,
        };
    }

    if (category instanceof Array) {
        where.AND = category.map((id) => ({
            categories: {
                some: {
                    id: parseInt(id),
                },
            },
        }));
    } else if (category) {
        where.categories = {
            some: {
                id: parseInt(category),
            },
        };
    }

    if (upcoming) {
        where.time = {
            gt: new Date().toISOString(),
        };
    }

    const cursorQuery = createCursor(page, res);

    try {
        const events = await prisma.event.findMany({
            ...cursorQuery,
            where,
            orderBy: {
                time: 'asc',
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

        // Response : No Event Found
        if (events.length === 0) {
            return res.status(404).json({
                message: 'No events found',
            });
        }

        const nextCursor = events[events.length - 1].id || null;
        const previousCursor = page ? events[0].id : null;
        // Response : Event retrieved
        return res.json({
            message: 'Events retrieved',
            data: events,
            next_cursor: nextCursor,
            previous_cursor: previousCursor,
        });
    } catch (e) {
        // Response : Something went wrong
        return res.status(400).json({
            message: 'Event cannot be retrieved',
        });
    }
});

router.route('/wishlist').get(async (req, res) => {
    const { page } = req.query;

    const cursorQuery = createCursor(page, res);

    try {
        const wishlist = await prisma.event.findMany({
            ...cursorQuery,
            where: {
                wishlists: {
                    some: {
                        studentId: {
                            equals: parseInt(req.user.student.id),
                        },
                    },
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

        if (wishlist.length === 0) {
            return res.status(404).json({
                message: 'No events found',
            });
        }

        const nextCursor = wishlist[wishlist.length - 1].id || null;
        const previousCursor = page ? wishlist[0].id : null;
        if (wishlist) {
            return res.json({
                message: 'Student wishlist retrieved',
                data: wishlist,
                next_cursor: nextCursor,
                previous_cursor: previousCursor,
            });
        }
    } catch (e) {
        return res.status(400).json({
            message: 'Wishlist cannot be retrieved',
        });
    }
});

router.route('/registered').get(async (req, res) => {
    const { page } = req.query;

    const cursorQuery = createCursor(page, res);

    try {
        const registered = await prisma.event.findMany({
            ...cursorQuery,
            where: {
                registers: {
                    some: {
                        studentId: parseInt(req.user.student.id),
                    },
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

        if (registered.length === 0) {
            return res.status(404).json({
                message: 'No events found',
            });
        }

        const nextCursor = registered[registered.length - 1].id || null;
        const previousCursor = page ? registered[0].id : null;
        return res.json({
            message: `Registered events`,
            data: registered,
            next_cursor: nextCursor,
            previous_cursor: previousCursor,
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Cannot get registered events',
        });
    }
});

router.route('/:id').get(async (req, res) => {
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

        // Check if already viewed
        const checkView = await prisma.view.findUnique({
            where: {
                studentId_eventId: {
                    studentId: parseInt(req.user.student.id),
                    eventId: parseInt(result.id),
                },
            },
        });

        // NOT Then add view
        if (!checkView) {
            await prisma.view.create({
                data: {
                    student: {
                        connect: { id: parseInt(req.user.student.id) },
                    },
                    event: {
                        connect: { id: parseInt(result.id) },
                    },
                },
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
});

// Register Event
router.post('/:id/register', async (req, res) => {
    try {
        const registered = await prisma.event.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                registers: {
                    create: {
                        student: {
                            connect: {
                                id: parseInt(req.user.student.id),
                            },
                        },
                    },
                },
            },
            include: {
                registers: {
                    where: {
                        event: {
                            id: parseInt(req.params.id),
                        },
                        student: {
                            id: parseInt(req.user.student.id),
                        },
                    },
                    include: {
                        student: {
                            select: {
                                id: true,
                                nim: true,
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (registered) {
            return res.status(201).json({
                message: 'Successfully registered for this event',
                data: registered,
            });
        }
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({
                message: 'Event not found',
            });
        } else if (e.code === 'P2002') {
            return res.status(400).json({
                message: 'You already registered for the event',
            });
        }
        return res.status(400).json({
            message: 'Event Registration failed',
        });
    }
});

// Add to Student Wishlist
router
    .route('/:id/wishlist')
    .post(async (req, res) => {
        try {
            const addWishlist = await prisma.event.update({
                where: {
                    id: parseInt(req.params.id),
                },
                data: {
                    wishlists: {
                        create: {
                            student: {
                                connect: {
                                    id: parseInt(req.user.student.id),
                                },
                            },
                        },
                    },
                },
            });

            if (addWishlist) {
                return res.status(201).json({
                    message: 'Event added to wishlist',
                    data: addWishlist,
                });
            }

            return res.status(400).json({
                message: 'Event failed to be added to wishlist',
            });
        } catch (e) {
            if (e.code === 'P2025') {
                return res.status(404).json({
                    message: 'Event not found',
                });
            } else if (e.code === 'P2002') {
                return res.status(400).json({
                    message: 'You already added event to wishlist',
                });
            }

            return res.status(400).json({
                message: 'Event failed to be added to wishlist',
            });
        }
    })
    .delete(async (req, res) => {
        try {
            const deleteWishlist = await prisma.wishlist.delete({
                where: {
                    studentId_eventId: {
                        studentId: parseInt(req.user.student.id),
                        eventId: parseInt(req.params.id),
                    },
                },
                include: {
                    event: {
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
                            _count: {
                                select: {
                                    registers: true,
                                    views: true,
                                },
                            },
                        },
                    },
                },
            });

            if (deleteWishlist) {
                return res.json({
                    message: 'Event successfully removed from wishlist',
                    data: deleteWishlist.event,
                });
            }
        } catch (e) {
            if (e.code === 'P2025') {
                return res.status(404).json({
                    message: 'Event is not in your wishlist',
                });
            }

            return res.status(400).json({
                message: 'Event cannot be removed from wishlist.',
            });
        }
    });

module.exports = router;
