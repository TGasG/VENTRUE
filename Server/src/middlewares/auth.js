const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');

module.exports = async (req, res, next) => {
    try {
        // Dapatkan cookie
        const token = req.cookies.JSESSIONID;

        if (!token) return res.status(403).json({ message: 'login required' });

        // Verify JWT
        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findFirst({
            where: { id: decode.id },
            include: {
                student: {
                    include: { faculty: true },
                },
                organization: {
                    include: { faculty: true },
                },
            },
        });

        // Amankan password agar tidak terekspos
        user.password = undefined;

        // Buat url untuk profile picture
        // Jika user tidak memiliki profile picture maka berikan gambar placeholder
        // Jika user memiliki profile picture buat url menunjuk gambar tersebut
        const port = process.env.PORT || 5000;
        const picturePath = user.picture
            ? req.protocol +
              '://' +
              req.hostname +
              ':' +
              port +
              '/upload/' +
              user.picture
            : req.protocol +
              '://' +
              req.hostname +
              ':' +
              port +
              '/upload/' +
              'placeholder.png';
        user.picture = picturePath;

        req.user = user;
        return next();
    } catch (e) {
        return res.status(403).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
};
