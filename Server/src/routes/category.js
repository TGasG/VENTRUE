const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Auth Middleware
router.use(auth);

// Menampilkan seluruh category
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        return res.json({
            data: categories,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Menampilkan category berdasarkan id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const categories = await prisma.category.findFirst({
            where: { id },
        });

        if (!categories)
            return res
                .status(404)
                .json({ message: `No category with id of ${id}` });

        return res.json({
            data: categories,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Menambahkan category
router.post('/', isAdmin, async (req, res) => {
    try {
        const name = req.body.name;

        // Jika name kosong
        if (!name) return res.status(400).json({ message: 'name is empty' });

        // Jika fakultas sudah pernah terdaftar
        const registeredCategory = await prisma.category.findFirst({
            where: { name: name.toLowerCase() },
        });
        if (registeredCategory)
            return res
                .status(400)
                .json({ message: `fakultas ${name} sudah ada` });

        await prisma.category.create({
            data: {
                name: name.toLowerCase(),
            },
        });

        return res.json({ message: 'Category saved' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Update category
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const name = req.body.name;

        // Jika id kosong
        if (!id) return res.status(400).json({ message: 'id is empty' });

        // Jika name kosong
        if (!name) return res.status(400).json({ message: 'name is empty' });

        const categories = await prisma.category.findFirst({
            where: { id },
        });

        if (!categories)
            return res
                .status(404)
                .json({ message: `No category with id of ${id}` });

        await prisma.category.update({
            where: { id },
            data: {
                name: name.toLowerCase(),
            },
        });

        return res.json({ message: 'Category updated' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Delete category
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Jika id kosong
        if (!id) return res.status(400).json({ message: 'id is empty' });

        const categories = await prisma.category.findFirst({
            where: { id },
        });

        if (!categories)
            return res
                .status(404)
                .json({ message: `No category with id of ${id}` });

        await prisma.category.delete({
            where: { id },
        });

        return res.json({ message: 'Category deleted' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
