const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // leer el token
    const token = req.header('x-auth-token');

    // si el token no corresponde
    if (!token) {
        return res.status(401).json({ status: 'Error', msg: 'Permiso denegado'});
    }

    // validar token
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        // enviamos la encriptacion por req.user
        req.user = encryption.user;
        next();

    } catch (error) {
        res.status(401).json({ status: 'Error', msg: 'Token no valido'});
    }
}