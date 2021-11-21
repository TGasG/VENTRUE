const Joi = require('joi').extend(require('@joi/date'));

// Register validation
const validateRegister = async (data) => {
    try {
        const joiObject = {
            name: Joi.string().max(255).required(),
            email: Joi.string()
                .lowercase()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ['com', 'net', 'id'] },
                })
                .required(),
            password: Joi.string().min(8).required(),
            repeatPassword: Joi.ref('password'),
            role: Joi.string()
                .lowercase()
                .pattern(/(admin|organization|user)/)
                .required(),
        };

        // Atribut berbeda berdasarkan role user
        if (data.role === 'organization') {
            if (data.level === 'faculty')
                joiObject.facultyId = Joi.number().required();

            joiObject.level = Joi.string()
                .lowercase()
                .pattern(/(faculty|university)/)
                .required();
            joiObject.description = Joi.string();
        } else if (data.role === 'user') {
            joiObject.facultyId = Joi.number().required();
            joiObject.nim = Joi.string()
                .pattern(/^\d{10}$/)
                .required();
        }

        const schema = Joi.object(joiObject).with('password', 'repeatPassword');

        const value = await schema.validateAsync(data);
        return [value, null];
    } catch (e) {
        return [null, e];
    }
};

// Update user validation
const validateUpdateUser = async (data, role) => {
    try {
        const joiObject = {
            name: Joi.string().max(255),
            email: Joi.string()
                .lowercase()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ['com', 'net', 'id'] },
                }),
            newPassword: Joi.string().min(8),
            repeatPassword: Joi.ref('newPassword'),
            phone: Joi.string()
                .max(14)
                .min(10)
                .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
        };

        // Jika user mengganti password harus disertakan dengan password lama
        if (data.newPassword) joiObject.password = Joi.string().required();

        // Atribut berbeda berdasarkan role user
        if (role === 'user' || role === 'organization') {
            joiObject.whatsapp = Joi.string()
                .max(14)
                .min(10)
                .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/);
            joiObject.instagram = Joi.string();
            joiObject.line = Joi.string();

            if (role === 'organization') {
                if (data.level === 'faculty')
                    joiObject.facultyId = Joi.number();

                joiObject.level = Joi.string()
                    .lowercase()
                    .pattern(/(faculty|university)/);
                joiObject.description = Joi.string();
            } else if (role === 'user') {
                joiObject.facultyId = Joi.number();
                joiObject.nim = Joi.string().pattern(/^\d{10}$/);
            }
        }

        const schema = Joi.object(joiObject).with(
            'newPassword',
            'repeatPassword'
        );

        const value = await schema.validateAsync(data);
        return [value, null];
    } catch (e) {
        return [null, e];
    }
};

// Event Validation
const validateEvent = async (data) => {
    try {
        const schema = Joi.object({
            name: Joi.string().max(255).required(),
            description: Joi.string(),
            time: Joi.date()
                .format('YYYY-MM-DDTHH:mm')
                .greater('now')
                .required(),
            price: Joi.number().integer().min(0).required(),
            categories: Joi.array().items(Joi.number()).required(),
            registerEnd: Joi.date()
                .format('YYYY-MM-DDTHH:mm')
                .greater('now')
                .required(),
        });
        const value = await schema.validateAsync(data);
        return [value, null];
    } catch (e) {
        return [null, e];
    }
};
const validateAdminUpdateUser = async (data, role) => {
    try {
        const joiObject = {
            name: Joi.string().max(255),
            email: Joi.string()
                .lowercase()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ['com', 'net', 'id'] },
                }),
            password: Joi.string().min(8),
            repeatPassword: Joi.ref('password'),
            phone: Joi.string()
                .max(14)
                .min(10)
                .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
        };

        // Atribut berbeda berdasarkan role user
        if (role === 'user' || role === 'organization') {
            joiObject.whatsapp = Joi.string()
                .max(14)
                .min(10)
                .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/);
            joiObject.instagram = Joi.string();
            joiObject.line = Joi.string();

            if (role === 'organization') {
                if (data.level === 'faculty')
                    joiObject.facultyId = Joi.number();

                joiObject.level = Joi.string()
                    .lowercase()
                    .pattern(/(faculty|university)/);
                joiObject.description = Joi.string();
            } else if (role === 'user') {
                joiObject.facultyId = Joi.number();
                joiObject.nim = Joi.string().pattern(/^\d{10}$/);
            }
        }

        const schema = Joi.object(joiObject).with('password', 'repeatPassword');

        const value = await schema.validateAsync(data);
        return [value, null];
    } catch (e) {
        return [null, e];
    }
};

module.exports = {
    validateRegister,
    validateUpdateUser,
    validateEvent,
    validateAdminUpdateUser,
};
