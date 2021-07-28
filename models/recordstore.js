const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const RecordStoreSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }   
    ]
})

module.exports = mongoose.model('RecordStore', RecordStoreSchema);