const express = require('express');
const router = express.Router();
const prisma = require('../../config/prismaClient');
const auth = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

// Auth Middleware
router.use(auth);

// isAdmin Middleware
router.use(isAdmin);

// Get Banners
router.get('/banners', async (req, res) => {
    try {
        const result = await prisma.banner.findMany({
            where: {
                OR: [
                    {
                        order: 1,
                    },
                    {
                        order: 2,
                    },
                    {
                        order: 3,
                    },
                ],
            },
            orderBy: {
                order: 'asc',
            },
            include: {
                event: {
                    include: {
                        images: true,
                        cover: {
                            include: {
                                image: true,
                            },
                        },
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

        return res.json({
            message: 'Banners retrieved',
            data: result,
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Banners cannot be retrieved',
        });
    }
});

// Update Banners
router.put('/banners/:order/events/:eventId', async (req, res) => {
    const { order, eventId } = req.params;
    if (order !== '1' && order !== '2' && order !== '3')
        return res.status(400).json({
            message: 'Wrong order',
        });

    try {
        await prisma.banner.update({
            where: {
                order: parseInt(order),
            },
            data: {
                eventId: parseInt(eventId),
            },
        });

        return res.json({
            message: 'Banner update berhasil',
        });
    } catch (e) {
        if (e.code === 'P2003')
            return res.status(404).json({
                message: 'Event not found',
            });

        return res.status(400).json({
            message: 'Banner update failed',
        });
    }
});

module.exports = router;
