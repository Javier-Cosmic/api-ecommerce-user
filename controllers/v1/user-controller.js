const User = require('../../models/Users');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {

    const {email, password} = req.body;

    try {
        // comprobar si ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ status: 'Error', msg: 'El usuario ya está registrado'});
        }

        // crear usuario con los datos enviados
        const databody = JSON.parse(JSON.stringify(req.body)); 

        const users = new User();
        users.name = databody.name;
        users.lastname = databody.lastname;
        users.email = databody.email;
        users.cellphone = databody.cellphone;

        // encriptar clave
        const salt = await bcrypt.genSalt(10);
        users.password = await bcrypt.hash(password, salt);
        
        console.log('datos del usuario: ', users)
        // console.log('datos del body', databody);

        console.log('datos del file', req.file);

        // await user.save();

        res.json({ msg: 'Usuario agregado exitosamente' });

        
    } catch (error) {
        res.status(400).json({ status: 'Error', msg: 'Error de servidor'})
    }
}

exports.getUser = async (req, res) => {
    try {
        const users = await User.find().select({ __v: 0, date: 0, password: 0}).sort({ date: -1});
        res.json({ users });

    } catch (error) {
        res.status(500).json({ status: 'Error', msg: 'Error de servidor'})
    }
}

exports.updateUser = async (req, res) => {
    const {name, lastname, email, password, cellphone, isAdmin} = req.body;
    let { newpassword } = req.body;
    const newUser = {}

    try {
        let user = await User.findOne({ email });

        // comparar password
        const passIsOk = await bcrypt.compare(password, user.password);
        if (!passIsOk) {
            return res.status(400).json({ status: 'Error', msg: 'Los password no coinciden'})
        }

        // encriptar nueva clave
        const salt = await bcrypt.genSalt(10);
        newpassword = await bcrypt.hash(newpassword, salt);

        if (email) {
            newUser.name = name,
            newUser.lastname = lastname,
            newUser.email = email,
            newUser.password = newpassword,
            newUser.cellphone = cellphone,
            newUser.isAdmin = isAdmin
        }

        user = await User.findByIdAndUpdate(
            { _id: req.params.id},
            { $set: newUser},
            {new: true}
        ).select({ _id: 0, __v: 0, date: 0, password: 0});

        res.json({ status: 'Usuario actualizado', data: user});
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'Error', msg: 'Error de servidor' });
    }
}

exports.deleteUser = async (req, res) => {
    try {

        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ status: 'Error', msg: 'El usuario no existe'});
        }

        await User.findByIdAndRemove({ _id: req.params.id });
        res.json({ msg: 'Usuario eliminado exitosamente'});

    } catch (error) {
        res.status(500).json({ status: 'Error', msg: 'Error de servidor'});
    }
}