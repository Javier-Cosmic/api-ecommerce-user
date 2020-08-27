const mongoose = require('mongoose');

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }),
        console.log('connection with mongo is ready')

    } catch (error) {
        console.log(error);
    }
} 

module.exports = connectionDB;