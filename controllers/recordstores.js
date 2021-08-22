const RecordStore = require('../models/recordstore');

module.exports.index = async (req, res, next) => {
    const recordstore = await RecordStore.find({});
    res.render('recordstores/index', {recordstore})
}

module.exports.postNew = async (req, res, next) => {
    const recordStore = new RecordStore(req.body.recordstore)
    recordStore.author = req.user._id;
    recordStore.images = req.files.map(image => ({url: image.path, filename: image.filename}))
    await recordStore.save()
    req.flash('success', 'New record store added!')
    res.redirect(`recordstores/${recordStore.id}`)
}

module.exports.renderNew = function(req, res) {
    res.render('recordstores/new');
}

module.exports.renderEdit = async (req, res, next) => {
    const recordstore = await RecordStore.findById(req.params.id)
    if(!recordstore){
        req.flash('error', 'That store can\'t be found')
        return res.redirect('/recordstores')
    }
    res.render('recordstores/edit', {recordstore})
}

module.exports.idStore = async (req, res, next) => {
    const recordstore = await RecordStore.findById(req.params.id).populate({path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author')
    const currentUser = req.user;
    if(!recordstore){
        req.flash('error', 'That store can\'t be found')
        return res.redirect('/recordstores')
    }
    res.render('recordstores/show', {recordstore, currentUser})
}

module.exports.editStore = async (req, res, next) => {
    const {id} = req.params
    const record = await RecordStore.findByIdAndUpdate(id, {...req.body.recordstore})
    req.flash('success', 'Record store updated!')
    res.redirect(`/recordstores/${record._id}`)
}

module.exports.deleteStore = async (req, res, next) => {
    const {id} = req.params;
    await RecordStore.findByIdAndDelete(id);
    req.flash('success', 'Record store deleted')
    res.redirect('/recordstores')
}