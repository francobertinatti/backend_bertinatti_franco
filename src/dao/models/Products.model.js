const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collectionName = 'product'

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
    owner: {
        type:String,
        default: 'admin',
        trim: true
    }
})

collectionSchema.plugin(mongoosePaginate)

const Products = mongoose.model(collectionName, collectionSchema)

module.exports = Products