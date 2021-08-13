const express = require('express')
const router = express.Router()
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
// custom Joi validation for creation of new record store and reviews
const RecordStore = require('../models/recordstore');
const { validationRS } = require('../models/validators/func/validationFunc')
const { checkAuth } = require('../middleware/checkAuth');

router
    .route('/')
    .get(wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.find({});
        res.render('recordstores/index', {recordstore})
    })
)
    .post(checkAuth, validationRS, wrapAsync(async (req, res, next) => {
        const recordStore = new RecordStore(req.body.recordstore)
        await recordStore.save()
        req.flash('success', 'New record store added!')
        res.redirect(`recordstores/${recordStore.id}`)
    })
)

router
    .route('/new')
    .get(checkAuth, (req, res) => {
        res.render('recordstores/new');
})

router
    .route('/:id')
    .get(wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id).populate('reviews')
        if(!recordstore){
            req.flash('error', 'That store can\'t be found')
            return res.redirect('/recordstores')
        }
        res.render('recordstores/show', {recordstore})
    })
)
    .put(checkAuth, validationRS, wrapAsync(async (req, res, next) => {
        const {id} = req.params
        const recordstore = await RecordStore.findByIdAndUpdate(id, {...req.body.recordstore})
        req.flash('success', 'Record store updated!')
        res.redirect(`/recordstores/${recordstore._id}`)
    })
)
    .delete(checkAuth, wrapAsync(async (req, res, next) => {
        const {id} = req.params;
        await RecordStore.findByIdAndDelete(id);
        req.flash('success', 'Record store deleted')
        res.redirect('/recordstores')
    })
)

router
    .route('/:id/edit')
    .get(checkAuth, wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id)
        if(!recordstore){
            req.flash('error', 'That store can\'t be found')
            return res.redirect('/recordstores')
        }
        res.render('recordstores/edit', {recordstore})
    }) 
)

module.exports = router