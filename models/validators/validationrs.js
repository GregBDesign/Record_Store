const Joi = require('joi');

/* Uses Joi package to validate newly created recordstores and 
ensure they match our Mongo schema before being commited to database */
const recordstoreSchema = Joi.object({
    recordstore: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports = recordstoreSchema;