const mongoose = require('mongoose');
const Carts = require('./Carts.model');

const collectionName = 'user';

const collectionSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type:String,
        unique: true
    },
    age: Number,
    password: String,
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Carts
    }, //Populate("cartId.carts")
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user',
    },
    documents: [
        {
            name: String,
            reference: String,
        }
    ],
    last_connection:  String
})

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;