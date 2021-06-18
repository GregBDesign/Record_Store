const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordStoreSchema = new Schema({
    title: String,
    description: String,
    location: String
})

module.exports = mongoose.model('RecordStore', RecordStoreSchema);