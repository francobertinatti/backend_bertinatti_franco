const mongoose = require('mongoose')

const collectionName = 'tickets'

const collectionSchema = new mongoose.Schema({
  code: {type: String, unique: true},
  purchase_datetime: {type: Date, default: Date.now},
  amount: Number,
  purchaser: String,
  productsProcessed: Array
})

const Tickets = mongoose.model(collectionName, collectionSchema)

module.exports = Tickets