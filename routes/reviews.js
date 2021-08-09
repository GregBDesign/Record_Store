const express = require('express')
const router = express.Router({mergeParams: true})
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
const RecordStore = require('../models/recordstore');
const Review = require('../models/review');
const { validationRev } = require('../models/validators/func/validationFunc')

router
    .route('/')
    .post(validationRev, wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id);
        const review = new Review(req.body.review);
        recordstore.reviews.push(review);
        await review.save();
        await recordstore.save();
        req.flash('success', 'Review added')
        res.redirect(`/recordstores/${recordstore._id}`);
    })
)

router
    .route('/:reviewId')
    .delete(wrapAsync(async (req, res) => {
        const {id, reviewId} = req.params
        await RecordStore.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review deleted')
        res.redirect(`/recordstores/${id}`);
    })
)

module.exports = router