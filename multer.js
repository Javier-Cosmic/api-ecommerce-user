const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(
            null,
            'image-' + new Date().getTime() + path.extname(file.originalname)
        );
    }
});

exports.upload = multer({ storage }).single('selectedImage');





