const mongoose = require('mongoose');
const Review = require('./review');
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

/* Deletion middleware to delete all reviews associated with a recordstore
on deletion of a recordstore */
RecordStoreSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
        }})
    }
})

module.exports = mongoose.model('RecordStore', RecordStoreSchema);