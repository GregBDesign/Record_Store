const wrapAsync = fn => {
    /* Function to catch errors in async functions. A function is returned which calls our passed in function and catches any errors.
    next() is then called to avoid the site hanging */
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports = wrapAsync