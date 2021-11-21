const express = require('express');
const router = express.Router();
const prisma = require('../../config/prismaClient');
const auth = require('../../middlewares/auth');
const { upload, deleteUpload } = require('../../config/eventImageUpload');
const isOrganization = require('../../middlewares/isOrganization');
const { validateEvent } = require('../../config/joi');
const multer = require('multer');
const exportRegistrationInfoToExcel = require('../../config/exportToExcel');
const isEventOwner = require('../../middlewares/isEventOwner');
const createCursor = require('../../utils/cursorQuery');

// Auth Middleware
router.use(auth);

// isOrganization Middleware
router.use(isOrganization);

// CRUD Event
router
    .route('/')
    .post(async (req, res) => {
        // Validasi inputan
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

        try {
            const newEvent = await prisma.event.create({
                data: {
                    name: data.name,
                    description: data.description,
                    time: data.time,
                    price: data.price,
                    registerEnd: data.registerEnd,
                    organization: {
                        connect: {
                            id: req.user.organization.id,
                        },
                    },
                    categories: {
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

            return res.status(201).json({
                message: 'Event created',
                data: newEvent,
            });
        } catch (e) {
            return res.status(400).json({
                message: 'Event creation failed',
                errors: e.message,
            });
        }
    })
    .get(async (req, res) => {
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

        // Cursor-based pagination
        const cursorQuery = createCursor(page, res);

        try {
            const events = await prisma.event.findMany({
                ...cursorQuery,
                where: {
                    ...where,
                    organizationId: req.user.organization.id,
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

// isEventOwner Middleware
router.use('/:id', isEventOwner);

router.post('/:id/upload', async (req, res) => {
    try {
        upload(req, res, async (err) => {
            // Jika multer mengalami error
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    message: 'Upload Error',
                    errors: err.message,
                });
            }
            // Jika gambar tidak ada
            if (!req.file)
                return res.status(400).json({ message: 'no image provided' });
            // Simpan nama gambar ke database
            const event = await prisma.event.update({
                where: { id: parseInt(req.params.id) },
                data: {
                    images: {
                        create: {
                            image: 'events/' + req.file.filename,
                        },
                    },
                },
                include: {
                    images: true,
                    cover: {
                        include: {
                            image: true,
                        },
                    },
                },
            });

            // Set first image as cover image if there is no cover image yet
            const cover = await prisma.coverImage.findUnique({
                where: {
                    eventId: parseInt(req.params.id),
                },
            });

            if (!cover) {
                try {
                    await prisma.coverImage.create({
                        data: {
                            eventId: parseInt(req.params.id),
                            imageId: parseInt(event.images[0].id),
                        },
                    });
                } catch (e) {
                    return res.status(400).json({
                        message: 'Cannot set first image as cover',
                    });
                }
            }
            // Kembalikan path gambar tersebut
            const port = process.env.PORT || 5000;
            return res.json({
                data: event,
                path:
                    req.protocol +
                    '://' +
                    req.hostname +
                    ':' +
                    port +
                    '/events/' +
                    req.file.filename,
            });
        });
    } catch (e) {
        return res
            .status(400)
            .json({ message: 'Upload failed', errors: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

router.delete('/:id/upload/:imageId', async (req, res) => {
    const foundImage = await prisma.image.findFirst({
        where: {
            id: parseInt(req.params.imageId),
            event: {
                id: parseInt(req.params.id),
            },
        },
        include: {
            event: {
                include: {
                    organization: true,
                },
            },
        },
    });

    if (!foundImage)
        return res.status(404).json({
            message: 'Image not found',
        });

    try {
        const deletedImage = await prisma.image.delete({
            where: {
                id: foundImage.id,
            },
        });

        if (deletedImage) {
            await deleteUpload(deletedImage.image);
        }

        return res.json({
            message: 'Image deleted',
            data: deletedImage,
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Image delete failed',
        });
    }
});

// Update Cover Image
router.put('/:id/cover/:imageId', async (req, res) => {
    const foundImage = await prisma.image.findFirst({
        where: {
            id: parseInt(req.params.imageId),
            event: {
                id: parseInt(req.params.id),
            },
        },
        include: {
            event: {
                include: {
                    organization: true,
                },
            },
        },
    });

    if (!foundImage)
        return res.status(404).json({
            message: 'Image not found',
        });

    try {
        const updatedCover = await prisma.coverImage.upsert({
            where: {
                eventId: parseInt(req.params.id),
            },
            update: {
                imageId: parseInt(req.params.imageId),
            },
            create: {
                eventId: parseInt(req.params.id),
                imageId: parseInt(req.params.imageId),
            },
            include: {
                image: true,
            },
        });

        return res.json({
            message: 'Cover updated',
            data: updatedCover,
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Cover update failed',
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

router.get('/:id/registered', async (req, res) => {
    try {
        const registrationInfo = await prisma.register.findMany({
            where: {
                event: {
                    id: parseInt(req.params.id),
                },
            },
            include: {
                student: {
                    include: {
                        faculty: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });

        if (registrationInfo.length === 0) {
            res.status(404).json({
                message: 'No students are registered in this event',
            });
        }

        return res.json({
            message: 'Students registered for this event retrieved',
            data: registrationInfo.map((info) => ({
                nim: info.student.nim,
                name: info.student.user.name,
                faculty: info.student.faculty.name,
                email: info.student.user.email,
                phone: info.student.user.phone || '',
                line: info.student.line || '',
                instagram: info.student.instagram || '',
                whatsapp: info.student.whatsapp || '',
                registerAt: info.registerAt,
            })),
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Cannot retrieve registered students for this event',
        });
    }
});

router.get('/:id/registered/download', async (req, res) => {
    try {
        const registrationInfo = await prisma.register.findMany({
            where: {
                event: {
                    id: parseInt(req.params.id),
                },
            },
            include: {
                student: {
                    include: {
                        faculty: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });

        if (registrationInfo.length === 0) {
            res.status(404).json({
                message: 'No students are registered in this event',
            });
        }

        const columnNames = [
            'NIM',
            'Nama',
            'Fakultas',
            'Email',
            'Nomor Telpon',
            'LINE',
            'Instagram',
            'WhatsApp',
            'Tanggal Registrasi',
        ];
        const sheetName = 'Registered Students';
        const fileName = `event-${req.params.id}-${new Date()
            .toISOString()
            .substring(0, 10)}.xlsx`;

        await exportRegistrationInfoToExcel(
            registrationInfo,
            columnNames,
            sheetName,
            fileName,
            res
        );
    } catch (e) {
        return res.status(400).json({
            message: 'Cannot download registered students for this event',
        });
    }
});

module.exports = router;
