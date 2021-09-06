const Joi = require('joi');

/* Uses Joi package to validate newly created recordstores and 
ensure they match our Mongo schema before being commited to database */
const recordstoreSchema = Joi.object({
    recordstore: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        /* Image validation - removed as in production I will disable image upload
        for Cloudinary storage space */
        // image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports = recordstoreSchema;