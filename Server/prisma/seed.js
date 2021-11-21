const prisma = require('../src/config/prismaClient');
const bcrypt = require('bcrypt');
require('dotenv').config();

const main = async () => {
    // Superuser
    await prisma.user.create({
        data: {
            name: process.env.SUPERUSER_NAME,
            email: process.env.SUPERUSER_EMAIL,
            role: 'admin',
            password: await bcrypt.hash(process.env.SUPERUSER_PASSWORD, 10),
        },
    });

    // Data faculty
    await prisma.faculty.createMany({
        data: [
            { name: 'ilmu komputer' },
            { name: 'ekonomi dan bisnis' },
            { name: 'kedokteran' },
            { name: 'teknik' },
            { name: 'ilmu sosial & ilmu politik' },
            { name: 'hukum' },
            { name: 'ilmu kesehatan' },
        ],
    });

    // Data ormawa
    await prisma.user.create({
        data: {
            name: 'KSM Android',
            email: 'android@upnvj.ac.id',
            role: 'organization',
            password: await bcrypt.hash('ksmandroid', 10),
            phone: '081312221841',
            organization: {
                create: {
                    facultyId: 1,
                    level: 'faculty',
                    description:
                        'A club made by students who have passion in Android and Web',
                    line: 'androidupnvj',
                    whatsapp: '081316472184',
                    instagram: 'androidupnvj',
                },
            },
        },
    });

    await prisma.user.create({
        data: {
            name: 'KSM Robotika',
            email: 'robotika@upnvj.ac.id',
            role: 'organization',
            password: await bcrypt.hash('ksmrobotika', 10),
            phone: '081312221844',
            organization: {
                create: {
                    facultyId: 1,
                    level: 'faculty',
                    description:
                        'A club made by students who have passion in Robotics',
                    line: 'robotikaupnvj',
                    whatsapp: '081316472182',
                    instagram: 'robotikaupnvj',
                },
            },
        },
    });

    await prisma.user.create({
        data: {
            name: 'KSM Multimedia',
            email: 'multimedia@upnvj.ac.id',
            role: 'organization',
            password: await bcrypt.hash('ksmmultimedia', 10),
            phone: '081312221847',
            organization: {
                create: {
                    facultyId: 1,
                    level: 'faculty',
                    description:
                        'A club made by students who have passion in Multimedia',
                    line: 'multimediaupnvj',
                    whatsapp: '081316472181',
                    instagram: 'multimediaupnvj',
                },
            },
        },
    });

    // Data category
    await prisma.category.createMany({
        data: [
            { name: 'workshop' },
            { name: 'webinar' },
            { name: 'lomba' },
            { name: 'formal' },
            { name: 'hiburan' },
        ],
    });

    // TODO : Data events
    await prisma.event.create({
        data: {
            name: 'Gathering Android 2021',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem. ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 0,
            organization: {
                connect: {
                    id: 1,
                },
            },
            categories: {
                connect: [
                    {
                        id: 5,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: '[WORKSHOP] UI/UX Beginner',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 20000,
            organization: {
                connect: {
                    id: 1,
                },
            },
            categories: {
                connect: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'Android Challenge 2021',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 0,
            organization: {
                connect: {
                    id: 1,
                },
            },
            categories: {
                connect: [
                    {
                        id: 3,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'Gathering Robotika 2021',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 0,
            organization: {
                connect: {
                    id: 2,
                },
            },
            categories: {
                connect: [
                    {
                        id: 5,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'Belajar Bareng Multimedia',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 0,
            organization: {
                connect: {
                    id: 3,
                },
            },
            categories: {
                connect: [
                    {
                        id: 3,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'AI Competition by KSM Robotika',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 20000,
            organization: {
                connect: {
                    id: 2,
                },
            },
            categories: {
                connect: [
                    {
                        id: 1,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'Gathering Multimedia 2021',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 0,
            organization: {
                connect: {
                    id: 3,
                },
            },
            categories: {
                connect: [
                    {
                        id: 5,
                    },
                ],
            },
        },
    });

    await prisma.event.create({
        data: {
            name: 'Videography Competition',
            description:
                'Donec porta a massa eu fermentum. Duis placerat, diam ut scelerisque fermentum, orci tellus scelerisque ante, id sagittis elit magna id diam. Aenean non fringilla sem.  ',
            time: new Date('2021-12-28T19:30').toISOString(),
            registerEnd: new Date('2021-12-28T19:00').toISOString(),
            price: 50000,
            organization: {
                connect: {
                    id: 3,
                },
            },
            categories: {
                connect: [
                    {
                        id: 3,
                    },
                ],
            },
        },
    });

    // TODO: Data banners
    await prisma.banner.createMany({
        data: [
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
    });
};

main()
    .catch((err) => console.error(err))
    .finally(async () => await prisma.$disconnect());
