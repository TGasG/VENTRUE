const { unlink } = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '..', '..', 'public', 'events'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2048000,
    },
}).single('images');

// TODO: Delete image
const deleteUpload = async (imagePath) => {
    const resultHandler = function (err) {
        if (err) {
            console.log('unlink failed', err);
            throw Error(err);
        } else {
            console.log('file deleted');
        }
    };
    await unlink(
        path.join(__dirname, '..', '..', 'public', imagePath),
        resultHandler
    );
};
module.exports = { upload, deleteUpload };
