const express = require('express');
const router = express.Router();
const {
    validateRegister,
    validateUpdateUser,
    validateAdminUpdateUser,
} = require('../config/joi');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const upload = require('../config/upload');

// Get current user
router.get('/', auth, (req, res) => {
    return res.json(req.user);
});

// Logout user
router.get('/logout', (req, res) => {
    return res
        .cookie('JSESSIONID', '', { maxAge: 0 })
        .json({ message: 'logged out' });
});

// Route admin melihat semua user yang ada
router.get('/all', auth, async (req, res) => {
    try {
        const skip = Number(req.query.skip) || undefined;
        const take = Number(req.query.take) || undefined;

        // Jika user bukan admin
        if (req.user.role !== 'admin')
            return res.status(403).json({
                message: `${req.user.role} not allowed to see this route`,
            });

        // Ambil semua data
        const users = await prisma.user.findMany({
            skip: skip,
            take: take,
            include: {
                student: true,
                organization: true,
            },
        });

        const port = process.env.PORT || 5000;
        users.map((user) => {
            user.password = undefined;
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
            return user;
        });

        return res.json(users);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Route register user
router.post('/register', async (req, res, next) => {
    try {
        // Validasi inputan
        const [data, validationError] = await validateRegister(req.body);
        if (validationError)
            return res
                .status(400)
                .json({ message: validationError.details[0].message });

        // Jangan izinkan user membuat akun organization atau admin
        if (data.role === 'organization' || data.role === 'admin') {
            // Dapatkan cookie
            const token = req.cookies.JSESSIONID;

            if (!token)
                return res.status(403).json({
                    message: `login required to create ${data.role} account`,
                });

            // Verify JWT
            const decode = await jwt.verify(token, process.env.JWT_SECRET);

            const user = await prisma.user.findFirst({
                where: { id: decode.id },
                select: { role: true },
            });

            if (user.role !== 'admin')
                return res.status(403).json({
                    message: `${user.role} are not allowed to make ${data.role} account`,
                });
        }

        // Check apakah email sudah pernah terdaftar
        const registeredEmail = await prisma.user.findFirst({
            where: { email: data.email },
        });
        if (registeredEmail)
            return res.status(400).json({
                message: `Email "${data.email}" already been registered`,
            });

        // Cek apakah nim sudah pernah terdaftar
        if (data.role === 'user') {
            const registeredNIM = await prisma.student.findFirst({
                where: { nim: data.nim },
            });
            if (registeredNIM)
                return res.status(400).json({
                    message: `NIM ${data.nim} already been registered`,
                });
        }

        // Check apakah faculty ada
        if (data.role === 'user' || data.level === 'faculty') {
            const faculty = await prisma.faculty.findFirst({
                where: { id: data.facultyId },
            });
            if (!faculty)
                return res.status(404).json({
                    message: `No faculty with id of ${data.facultyId}`,
                });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Siapkan user
        const newUser = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        };

        if (data.role === 'user') {
            newUser.student = {
                create: {
                    nim: data.nim,
                    faculty: {
                        connect: {
                            id: data.facultyId,
                        },
                    },
                },
            };
        } else if (data.role === 'organization') {
            newUser.organization = {
                create: {
                    faculty:
                        data.level === 'faculty'
                            ? {
                                  connect: {
                                      id: data.facultyId,
                                  },
                              }
                            : undefined,
                    level: data.level,
                    description: data.description,
                },
            };
        }

        // Save ke database
        await prisma.user.create({ data: newUser });

        return res.json({ message: 'User saved!' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check apakah email dan password ada
        if (!email) return res.status(400).json({ message: 'email is empty' });
        if (!password)
            return res.status(400).json({ message: 'password is empty' });

        // Check apakah user dengan email yang dimasukkan ada
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                password: true,
            },
        });
        if (!user)
            return res.status(404).json({ message: 'user not registered' });

        // Check password
        const result = await bcrypt.compare(password, user.password);
        if (!result)
            return res.status(401).json({ message: 'password incorrect' });

        // Buat JWT
        const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            algorithm: 'HS512',
            expiresIn: '30d',
        });

        return res
            .cookie('JSESSIONID', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 3600000),
            })
            .json({ message: 'logged in' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Upload profile picture
router.post('/upload', auth, async (req, res) => {
    try {
        upload(req, res, async (err) => {
            // Jika multer mengalami error
            if (err) throw err;

            // Jika gambar tidak ada
            if (!req.file)
                return res.status(400).json({ message: 'no image provided' });

            // Simpan nama gambar ke database
            await prisma.user.update({
                where: { id: req.user.id },
                data: { picture: req.file.filename },
            });

            // Kembalikan path gambar tersebut
            const port = process.env.PORT || 5000;
            return res.json({
                path:
                    req.protocol +
                    '://' +
                    req.hostname +
                    ':' +
                    port +
                    '/upload/' +
                    req.file.filename,
            });
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Route update user
router.put('/', auth, async (req, res) => {
    try {
        // Validasi incoming request
        const [data, validationError] = await validateUpdateUser(
            req.body,
            req.user.role
        );
        if (validationError)
            return res
                .status(400)
                .json({ message: validationError.details[0].message });

        // Jika user berusaha mengganti password
        let hashPassword = null;
        if (data.password) {
            const user = await prisma.user.findFirst({
                where: { id: req.user.id },
                select: { password: true },
            });

            // Compare password
            const result = await bcrypt.compare(data.password, user.password);
            if (!result)
                return res.status(401).json({ message: 'password incorrect' });

            // Hash password
            hashPassword = await bcrypt.hash(data.newPassword, 10);
        }

        // Check apakah email sudah pernah terdaftar jika user berusaha mengganti email
        if (data.email) {
            const registeredEmail = await prisma.user.findFirst({
                where: { email: data.email },
            });
            if (registeredEmail)
                return res.status(400).json({
                    message: `Email "${data.email}" already been registered`,
                });
        }

        // Cek apakah nim sudah pernah terdaftar jika user mengganti nim
        if (data.nim) {
            const registeredNIM = await prisma.student.findFirst({
                where: { nim: data.nim },
            });
            if (registeredNIM)
                return res.status(400).json({
                    message: `NIM ${data.nim} already been registered`,
                });
        }

        // Check apakah faculty ada jika user berusaha mengganti faculty
        if (data.facultyId) {
            const faculty = await prisma.faculty.findFirst({
                where: { id: data.facultyId },
            });
            if (!faculty)
                return res.status(404).json({
                    message: `No faculty with id of ${data.facultyId}`,
                });
        }

        // Siapkan schema update
        const updateSchema = {
            name: data.name,
            email: data.email,
            phone: data.phone,
        };

        // Jika user update password
        if (hashPassword) updateSchema.password = hashPassword;

        // Schema berbeda untuk setiap role
        if (req.user.role === 'organization') {
            const organizationUpdateSchema = {
                level: data.level,
                description: data.description,
                whatsapp: data.whatsapp,
                instagram: data.instagram,
                line: data.line,
            };

            if (data.facultyId)
                organizationUpdateSchema.faculty = {
                    connect: {
                        id: data.facultyId,
                    },
                };

            updateSchema.organization = {
                update: organizationUpdateSchema,
            };
        } else if (req.user.role === 'user') {
            const userUpdateSchema = {
                nim: data.nim,
                line: data.line,
                instagram: data.instagram,
                whatsapp: data.whatsapp,
            };

            if (data.facultyId)
                userUpdateSchema.faculty = {
                    connect: {
                        id: data.facultyId,
                    },
                };

            updateSchema.student = {
                update: userUpdateSchema,
            };
        }

        // Update user
        await prisma.user.update({
            where: { id: req.user.id },
            data: updateSchema,
        });

        return res.json({ message: 'User updated' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Router untuk melihat profile user dari parameter id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Jika id tidak ada
        if (!id)
            return res
                .status(400)
                .message({ message: 'please provide with valid id' });

        // Mecari user
        const user = await prisma.user.findFirst({
            where: { id },
            include: {
                student: {
                    include: { faculty: true },
                },
                organization: {
                    include: { faculty: true },
                },
            },
        });

        // Jika user tidak ditemukan
        if (!user)
            return res
                .status(404)
                .json({ message: `No user with id of ${id}` });

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

        return res.json(user);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Route admin update user
router.put('/:id', auth, async (req, res) => {
    try {
        // Jika user bukan admin
        if (req.user.role !== 'admin')
            return res
                .status(403)
                .json({ message: `${req.user.role} cannot edit another user` });

        const id = Number(req.params.id);
        if (!id)
            return res
                .status(400)
                .message({ message: 'please provide with valid id' });

        const user = await prisma.user.findFirst({
            where: { id },
            select: { role: true },
        });
        if (!user)
            return res
                .status(404)
                .json({ message: `no user with id of ${id}` });

        // Validasi incoming request
        const [data, validationError] = await validateAdminUpdateUser(
            req.body,
            user.role
        );
        if (validationError)
            return res
                .status(400)
                .json({ message: validationError.details[0].message });

        // Jika user berusaha mengganti password
        let hashPassword = null;
        if (data.password) hashPassword = await bcrypt.hash(data.password, 10);

        // Check apakah email sudah pernah terdaftar jika user berusaha mengganti email
        if (data.email) {
            const registeredEmail = await prisma.user.findFirst({
                where: { email: data.email },
            });
            if (registeredEmail)
                return res.status(400).json({
                    message: `Email "${data.email}" already been registered`,
                });
        }

        // Cek apakah nim sudah pernah terdaftar jika user mengganti nim
        if (data.nim) {
            const registeredNIM = await prisma.student.findFirst({
                where: { nim: data.nim },
            });
            if (registeredNIM)
                return res.status(400).json({
                    message: `NIM ${data.nim} already been registered`,
                });
        }

        // Check apakah faculty ada jika user berusaha mengganti faculty
        if (data.facultyId) {
            const faculty = await prisma.faculty.findFirst({
                where: { id: data.facultyId },
            });
            if (!faculty)
                return res.status(404).json({
                    message: `No faculty with id of ${data.facultyId}`,
                });
        }

        // Siapkan schema update
        const updateSchema = {
            name: data.name,
            email: data.email,
            phone: data.phone,
        };

        // Jika admin update password
        if (hashPassword) updateSchema.password = hashPassword;

        // Schema berbeda untuk setiap role
        if (user.role === 'organization') {
            const organizationUpdateSchema = {
                level: data.level,
                description: data.description,
                whatsapp: data.whatsapp,
                instagram: data.instagram,
                line: data.line,
            };

            if (data.facultyId)
                organizationUpdateSchema.faculty = {
                    connect: {
                        id: data.facultyId,
                    },
                };

            updateSchema.organization = {
                update: organizationUpdateSchema,
            };
        } else if (user.role === 'user') {
            const userUpdateSchema = {
                nim: data.nim,
                line: data.line,
                instagram: data.instagram,
                whatsapp: data.whatsapp,
            };

            if (data.facultyId)
                userUpdateSchema.faculty = {
                    connect: {
                        id: data.facultyId,
                    },
                };

            updateSchema.student = {
                update: userUpdateSchema,
            };
        }

        // Update user
        await prisma.user.update({
            where: { id },
            data: updateSchema,
        });

        return res.json({ message: 'User updated' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Route delete user
router.delete('/', auth, async (req, res) => {
    try {
        const password = req.body.password;

        // Jika password kosong
        if (!password)
            return res.status(401).json({ message: 'password required' });

        // Ambil hash password yang tersimpan
        const user = await prisma.user.findFirst({
            where: { id: req.user.id },
            select: { password: true },
        });

        // Compare password
        const result = await bcrypt.compare(password, user.password);
        if (!result)
            return res.status(401).json({ message: 'password incorrect' });

        // Delete user
        await prisma.user.delete({
            where: { id: req.user.id },
        });

        return res
            .cookie('JSESSIONID', '', { maxAge: 0 })
            .json({ message: 'user deleted' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

// Route delete user by admin
router.delete('/:id', auth, async (req, res) => {
    try {
        // Chek apakah user adalah admin
        if (req.user.role !== 'admin')
            return res.status(403).json({
                message: `${req.user.role} not allowed to delete other user`,
            });

        const userId = Number(req.params.id);
        const password = req.body.password;

        // Jika id tidak valid
        if (!userId)
            return res
                .status(400)
                .message({ message: 'please provide with valid id' });

        // Check apakah password ada isiannya
        if (!password)
            return res.status(401).json({ message: 'password is empty' });

        // Check apakah ada user dengan ID yang di input
        const user = await prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user)
            return res
                .status(404)
                .json({ message: `no user with id of ${userId}` });

        // Dapatkan password admin
        const admin = await prisma.user.findFirst({
            where: { id: req.user.id },
            select: { password: true },
        });

        // Check password
        const result = await bcrypt.compare(password, admin.password);
        if (!result)
            return res.status(401).json({ message: 'password incorrect' });

        // Delete user
        await prisma.user.delete({
            where: { id: userId },
        });

        return res.json({ message: 'user deleted' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
