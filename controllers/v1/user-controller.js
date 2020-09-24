const User = require('../../models/Users');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.createUser = async (req, res) => {

    const {email, password} = req.body;
 
    try {
        const databody = JSON.parse(JSON.stringify(req.body));

        const { name, lastname, cellphone } = databody;

        if (
            name.trim() === '' ||
            lastname.trim() === '' ||
            email.trim() === '' ||
            password.trim() === '' ||
            cellphone.trim() === ''
        ) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Los campos son obligatorios' });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Debes subir una imagen' });
        }

        // comprobar si ya existe
        let user = await User.findOne({ email });
        if (user) {

            return res.status(400).json({
                status: 'Error',
                msg: 'El usuario ya está registrado',
            });
        }

        // //cloudinary subir imagen
        const resultImg = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: '/photo-users',
        });

        const users = new User();
        users.name = name;
        users.lastname = lastname;
        users.email = email;
        users.cellphone = cellphone;
        users.image_url = resultImg.secure_url;
        users.image_id = resultImg.public_id;

        // encriptar clave
        const salt = await bcrypt.genSalt(10);
        users.password = await bcrypt.hash(password, salt);
        await users.save();

        res.json({ msg: 'Usuario agregado', users });
        await fs.unlink(req.file.path);

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Error', msg: 'Error de servidor' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const users = await User.find()
            .select({ __v: 0, date: 0, password: 0, image_id: 0 })
            .sort({ date: -1 });
        res.json({ users });

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Error', msg: 'Error de servidor' });
    }
};

exports.updateUser = async (req, res) => {
    const newUser = {};
    
    try {
        const { email, password } = req.body;
        const databody = JSON.parse(JSON.stringify(req.body));

        let { newpassword } = req.body;

        let user = await User.findOne({ email });

        if (
            databody.name.trim() === '' ||
            databody.lastname.trim() === '' ||
            databody.email.trim() === '' ||
            databody.password.trim() === '' ||
            databody.cellphone.trim() === '' ||
            newpassword.trim() === ''
        ) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Los campos son obligatorios.' });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Debes subir una imagen' });
        }

        // comparar password
        const passIsOk = await bcrypt.compare(password, user.password);
        if (!passIsOk) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Los password no coinciden' });
        }

        // encriptar nueva clave
        const salt = await bcrypt.genSalt(10);
        newpassword = await bcrypt.hash(newpassword, salt);

        if (email) {
            (newUser.name = databody.name),
                (newUser.lastname = databody.lastname),
                (newUser.email = databody.email),
                (newUser.password = newpassword),
                (newUser.cellphone = databody.cellphone);

            //cloudinary
            if (req.file) {
                await cloudinary.v2.uploader.destroy(user.image_id);

                const resultImg = await cloudinary.v2.uploader.upload(
                    req.file.path,
                    { folder: '/photo-users' }
                );
                newUser.image_url = resultImg.secure_url;
                newUser.image_id = resultImg.public_id;
            }
        }

        user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: newUser },
            { new: true }
        ).select({ __v: 0, date: 0, password: 0, image_id: 0 });

        res.json({ msg: 'Usuario actualizado', useredit: user });

        await fs.unlink(req.file.path);
    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Error de servidor' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                status: 'Error',
                msg: 'El usuario no existe',
            });
        }

        await User.findByIdAndRemove({ _id: req.params.id });
        await cloudinary.v2.uploader.destroy(user.image_id);

        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Error', msg: 'Error de servidor' });
    }
};
