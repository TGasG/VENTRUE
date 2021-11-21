const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const auth = require('../middlewares/auth');

// Menampilkan seluruh faculty
router.get('/', async (req, res) => {
    try {
        const faculties = await prisma.faculty.findMany();

        return res.json(faculties);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Menampilkan faculty berdasarkan id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const faculties = await prisma.faculty.findFirst({
            where: { id },
        });

        if (!faculties)
            return res
                .status(404)
                .json({ message: `No faculty with id of ${id}` });

        return res.json(faculties);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Menambahkan faculty
router.post('/', auth, async (req, res) => {
    try {
        // Jika user bukan admin
        if (req.user.role !== 'admin')
            return res
                .status(403)
                .json({ message: `${req.user.role} cannot change faculty` });

        const name = req.body.name;

        // Jika name kosong
        if (!name) return res.status(400).json({ message: 'name is empty' });

        // Jika fakultas sudah pernah terdaftar
        const registeredFaculty = await prisma.faculty.findFirst({
            where: { name: name.toLowerCase() },
        });
        if (registeredFaculty)
            return res
                .status(400)
                .json({ message: `fakultas ${name} sudah ada` });

        await prisma.faculty.create({
            data: {
                name: name.toLowerCase(),
            },
        });

        return res.json({ message: 'Faculty saved' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Update faculty
router.put('/:id', auth, async (req, res) => {
    try {
        // Jika user bukan admin
        if (req.user.role !== 'admin')
            return res
                .status(403)
                .json({ message: `${req.user.role} cannot change faculty` });

        const id = Number(req.params.id);
        const name = req.body.name;

        // Jika id kosong
        if (!id) return res.status(400).json({ message: 'id is empty' });

        // Jika name kosong
        if (!name) return res.status(400).json({ message: 'name is empty' });

        const faculties = await prisma.faculty.findFirst({
            where: { id },
        });

        if (!faculties)
            return res
                .status(404)
                .json({ message: `No faculty with id of ${id}` });

        await prisma.faculty.update({
            where: { id },
            data: {
                name: name.toLowerCase(),
            },
        });

        return res.json({ message: 'Faculty updated' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Delete faculty
router.delete('/:id', auth, async (req, res) => {
    try {
        // Jika user bukan admin
        if (req.user.role !== 'admin')
            return res
                .status(403)
                .json({ message: `${req.user.role} cannot change faculty` });

        const id = Number(req.params.id);

        // Jika id kosong
        if (!id) return res.status(400).json({ message: 'id is empty' });

        const faculties = await prisma.faculty.findFirst({
            where: { id },
        });

        if (!faculties)
            return res
                .status(404)
                .json({ message: `No faculty with id of ${id}` });

        await prisma.faculty.delete({
            where: { id },
        });

        return res.json({ message: 'Faculty deleted' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
