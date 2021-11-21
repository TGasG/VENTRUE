const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, files, cb) =>
        cb(null, path.resolve(__dirname, '..', '..', 'public', 'upload')),
    filename: (req, file, cb) => {
        const pictureName =
            file.fieldname +
            '-' +
            req.user.id +
            path.extname(file.originalname);
        return cb(null, pictureName);
    },
});

// Init upload
const upload = multer({
    storage,
}).single('profile');

module.exports = upload;
