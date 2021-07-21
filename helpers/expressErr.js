// Extension of Error class. Receives a custom error message and status code
class ExpressError extends Error {
    constructor(message, statusCode){
        super()
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError