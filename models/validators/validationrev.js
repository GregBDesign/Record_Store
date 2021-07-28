const Joi = require('joi');

/* Uses Joi package to validate newly created recordstores and 
ensure they match our Mongo schema before being commited to database */
const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().integer().required().min(1).max(5),
    }).required()
})

module.exports = reviewSchema;