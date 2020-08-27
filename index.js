require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const connectionDB = require('./config/db');

const port = process.env.PORT || 2020;

const app = express();
connectionDB();

app.use(cors());
app.use(express.json({ extended: true }));

app.get('/', (req, res) => {
    res.send('API of E-commerce')
})

app.listen(port, '0.0.0.0', () => {
    console.log('server is ready in port ', port);
})