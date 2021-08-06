const express = require('express')
const router = express.Router()
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
// custom Joi validation for creation of new record store and reviews
const RecordStore = require('../models/recordstore');
const Review = require('../models/review');
const { validationRS, validationRev } = require('../models/validators/func/validationFunc')

router
    .route('/')
    .get(wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.find({});
        res.render('recordstores/index', {recordstore})
    })
)
    .post(validationRS, wrapAsync(async (req, res, next) => {
        const recordStore = new RecordStore(req.body.recordstore);
        await recordStore.save();
        res.redirect(`recordstores/${recordStore.id}`);
    })
)

router
    .route('/new')
    .get(wrapAsync(async (req, res, next) => {
        res.render('recordstores/new');
    })
)

router
    .route('/:id')
    .get(wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id).populate('reviews')
        res.render('recordstores/show', {recordstore})
    })
)
    .put(validationRS, wrapAsync(async (req, res, next) => {
        const {id} = req.params
        const recordstore = await RecordStore.findByIdAndUpdate(id, {...req.body.recordstore})
        res.redirect(`/recordstores/${recordstore._id}`)
    })
)
    .delete(wrapAsync(async (req, res, next) => {
        const {id} = req.params;
        await RecordStore.findByIdAndDelete(id);
        res.redirect('/recordstores')
    })
)

router
    .route('/:id/edit')
    .get(wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id)
        res.render('recordstores/edit', {recordstore})
    }) 
)

router
    .route('/:id/reviews')
    .post(validationRev, wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id);
        const review = new Review(req.body.review);
        recordstore.reviews.push(review);
        await review.save();
        await recordstore.save();
        res.redirect(`/recordstores/${recordstore._id}`);
    })
)

router
    .route('/:id/reviews/:reviewId')
    .delete(wrapAsync(async (req, res) => {
        const {id, reviewId} = req.params
        await RecordStore.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/recordstores/${id}`);
    })
)

module.exports = router