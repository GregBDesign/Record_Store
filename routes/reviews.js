const express = require('express')
const router = express.Router({mergeParams: true})
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
const review = require('../controllers/reviews')
const { validationRev } = require('../models/validators/func/validationFunc')
const { checkAuth, canEditReview } = require('../middleware/checkAuth')

router
    .route('/')
    .post(checkAuth, validationRev, wrapAsync(review.newReview))

router
    .route('/:reviewId')
    .delete(checkAuth, canEditReview, wrapAsync(review.deleteReview))

module.exports = router