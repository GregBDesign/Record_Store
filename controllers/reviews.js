const Review = require('../models/review');
const RecordStore = require('../models/recordstore');

module.exports.newReview = async (req, res, next) => {
    const recordstore = await RecordStore.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    recordstore.reviews.push(review);
    await review.save();
    await recordstore.save();
    req.flash('success', 'Review added')
    res.redirect(`/recordstores/${recordstore._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    await RecordStore.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted')
    res.redirect(`/recordstores/${id}`);
}