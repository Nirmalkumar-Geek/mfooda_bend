const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        callback(null, path.join("/var/labsstorage/home/nirmalkumarv24/htdocs/API/mfooda_rest/public", '/images'));
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + "." + extension);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        if (!extension) {
            req.fileValidationError = 'File format not supported';
            return callback(null, false);
        }
        callback(null, true);
    }
}).single("file");

module.exports = upload;
