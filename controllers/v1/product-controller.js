const Products = require('../../models/Products');
const Users = require('../../models/Users');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.createProduct = async (req, res) => {
    const datafront = JSON.parse(JSON.stringify(req.body));
    const id = datafront.userid;

    try {
        const { name, price, description, category, brand, stock } = JSON.parse(
            datafront.product
        );

        const user = await Users.findOne({ _id: id });

        if (!user) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'El usuario no existe' });
        }

        // verificar si corresponde al user autenticado
        if (user._id.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ status: 'Error', msg: 'No autorizado' });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ status: 'Error', msg: 'Debes subir una imagen' });
        }

        //cloudinary subir imagen
        const resultImg = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: '/products',
        });

        const product = new Products({
            name,
            price,
            description,
            category,
            brand,
            stock,
            user: datafront.userid,
            image_url: resultImg.secure_url,
            image_id: resultImg.public_id,
        });

        await product.save();

        res.json({ msg: 'Producto agregado', product });

        await fs.unlink(req.file.path);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Error',
            msg: 'Hubo un error de servidor',
        });
    }
};

exports.showProducts = async (req, res) => {
    try {
        const products = await Products.find()
            .select({ __v: 0, date: 0, image_id: 0 })
            .sort({ date: -1 });

        res.json({ products });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Error',
            msg: 'Hubo un error de servidor',
        });
    }
};

exports.deleteProducts = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({ status: 'Error', msg: 'No existe ese producto' });
        }

        // verificar si corresponde al user autenticado
        if (product.user.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ status: 'Error', msg: 'No autorizado' });
        }

        await Products.findOneAndRemove({ _id: req.params.id })
        await cloudinary.v2.uploader.destroy(product.image_id);
        
        res.json({ msg: 'Producto eliminado'})

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'Error',
            msg: 'Hubo un error de servidor',
        });
    }
};
