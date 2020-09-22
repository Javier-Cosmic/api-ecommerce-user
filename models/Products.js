const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true
    },
    price:{
        type: Number,
        default: 0
    },
    image_url:{
        type: String,
    },
    image_id:{
        type: String,
    },
    description: {
        type: String
    },
    category:{
        type: String
    },
    brand:{
        type: String,
        trim: true
    },
    stock:{
        type: Number
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', ProductSchema);