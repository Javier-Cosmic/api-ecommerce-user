require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const connectionDB = require('./config/db');
const { upload } = require('./multer');
const multer = require('multer')    

const port = process.env.PORT || 2020;

const app = express();
connectionDB();

// middlewares
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.json({ msg: 'Error de multer'})
        } 
        next();
    });
});

// ruta x defecto
app.get('/', (req, res) => {
    res.send('API of E-commerce');
});

app.use('/api/v1/login', require('./routes/v1/login-route'));
app.use('/api/v1/users', require('./routes/v1/user-route'));
app.use('/api/v1/products', require('./routes/v1/product-route'));

app.listen(port, '0.0.0.0', () => {
    console.log('server is ready in port ', port);
});
