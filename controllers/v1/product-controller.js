const Products = require('../../models/Products');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.createProduct = async (req, res) => {
    
    const datafront = JSON.parse(JSON.stringify(req.body));
    const user = datafront.userid;

    try {
        const {name, price, description, category, brand, stock} = JSON.parse(datafront.product);

        const userid = await Products.findOne({ user });

        if (!userid) {
            return res.status(400).json({ status: 'Error', msg: 'El usuario no existe'});
        }

        // verificar si corresponde al user autenticado
        if (userid.user.toString() !== req.user.id ) {
            return res.status(401).json({ status: 'Error', msg: 'No autorizado'})
        }

        if (!req.file) {
            return res.status(400).json({ status: 'Error', msg: 'Debes subir una imagen' });
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
            image_id: resultImg.public_id
        });

        await product.save()

        res.json({ msg: 'Producto agregado', product});

        await fs.unlink(req.file.path);

    } catch (error) {
        res.status(500).json({ status: 'Error', msg: 'Hubo un error de servidor.'})
    }
} 

exports.showProducts = (req, res) => {
    console.log('desde show products');
} 

exports.deleteProducts = (req, res) => {
    console.log('desde delete products');
}