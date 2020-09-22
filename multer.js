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

exports.upload = multer({
    storage

}).single('selectedImage');


exports.uploadFile = (req, res, next) => {
    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            const filesType = /jpeg|jpg|png|gif/;
            const mimetype = filesType.test(file.mimetype);
            const extname = filesType.test(path.extname(file.originalname));
            if (mimetype && extname) {
                return cb(null, true);            
            }
            cb('Error, imagen no permitida');
        }
    
    }).single('selectedImage');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ msg: 'Error de multer'})
        } else if (err) {
            res.json({ msg: 'Error desconocido'})
        }
        next();
    })
}
