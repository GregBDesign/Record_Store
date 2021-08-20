const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
// custom Joi validation for creation of new record store and reviews
const recordstore = require('../controllers/recordstores')
const { validationRS } = require('../models/validators/func/validationFunc')
const { checkAuth, canEdit } = require('../middleware/checkAuth');

router
    .route('/')
    .get(wrapAsync(recordstore.index))
    // .post(checkAuth, validationRS, wrapAsync(recordstore.postNew))
    .post(upload.array('recordstore[image]'), (req, res) => {
        console.log(req.body, req.files)
        res.send('Works')
    })

router
    .route('/new')
    .get(checkAuth, recordstore.renderNew)

router
    .route('/:id')
    .get(wrapAsync(recordstore.idStore))
    .put(checkAuth, canEdit, validationRS, wrapAsync(recordstore.editStore))
    .delete(checkAuth, canEdit, wrapAsync(recordstore.deleteStore))

router
    .route('/:id/edit')
    .get(checkAuth, canEdit, wrapAsync(recordstore.renderEdit))

module.exports = router