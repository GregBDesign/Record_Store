const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

/* Add virtual to ImageSchema so when 'thumbnail' is called
a smaller version of image is returned using Cloudinary Transformations */
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const LocationSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

const opts = {toJSON: {virtuals: true}};

const RecordStoreSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: LocationSchema,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }   
    ]
}, opts)

/* Adds virtual to properties.popUpText to pass store name and id
to mapBox cluster map to add name and link to view page for store */
RecordStoreSchema.virtual('properties.popUpText').get(function() {
    return `<h2><a href="/recordstores/${this._id}">${this.title}</a></h2>`
})

/* Deletion middleware to delete all reviews associated with a recordstore
on deletion of a recordstore */
RecordStoreSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
        }})
    }
})

module.exports = mongoose.model('RecordStore', RecordStoreSchema);