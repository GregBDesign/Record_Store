const rsvalidator = require('../validationrs');
const reviewvalidator = require('../validationrev');

// validation with custom Joi validation schema
module.exports.validationRS = (req, res, next) => {
    const {error} = rsvalidator.validate(req.body)
    if(error){
        const errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errMsg, 500);
    }
    next();
}

module.exports.validationRev = (req, res, next) => {
    const {error} = reviewvalidator.validate(req.body)
    if(error){
        const errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errMsg, 500)
    }
    next();
}