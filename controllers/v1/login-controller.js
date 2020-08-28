const User = require('../../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.loginAuth = async (req, res) => {
    
    const {email, password} = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'Error', msg: 'El usuario no existe'});
        }

        // comparar password
        const passIsOk = await bcrypt.compare(password, user.password);

        // si es password no es correcto
        if (!passIsOk) {
            return res.status(400).json({ status: 'Error', msg: 'Password incorrecto'})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3000

        }, (error, token) => {
            if (error) throw error; 
                
                res.json({ token })
            }
        );

    } catch (error) {
        res.status(400).json({ status: 'Error', msg: 'Error de servidor'})
    }
}

exports.userIsAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });

    } catch (error) {
        res.status(500).json({ status: 'Error', msg: 'Error de servidor'})
    }
}