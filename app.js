const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// ejsMate used for layout and partials in views
const ejsMate = require('ejs-mate');
// custom Joi validation for creation of new record store and reviews
const rsvalidator = require('./models/validators/validationrs');
const reviewvalidator = require('./models/validators/validationrev');
// custom function for handling errors in async functions
const wrapAsync = require('./helpers/wrapAsync');
// extension of Error class, allows a custom error and http response code to be passed to error handling middleware
const ExpressError = require('./helpers/expressErr');
const methodOverride = require('method-override');
const RecordStore = require('./models/recordstore');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/record-store', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
   
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// validation with custom Joi validation schema
const validationRS = (req, res, next) => {
    const {error} = rsvalidator.validate(req.body)
    if(error){
        const errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errMsg, 500);
    }
    next();
}

const validationRev = (req, res, next) => {
    const {error} = reviewvalidator.validate(req.body)
    if(error){
        const errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errMsg, 500)
    }
    next();
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/recordstores', wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.find({});
        res.render('recordstores/index', {recordstore})
    })
)

app.get('/recordstores/new', wrapAsync(async (req, res, next) => {
        res.render('recordstores/new');
    })
)

app.post('/recordstores', validationRS, wrapAsync(async (req, res, next) => {
        const recordStore = new RecordStore(req.body.recordstore);
        await recordStore.save();
        res.redirect(`recordstores/${recordStore.id}`);
    })
)

app.get('/recordstores/:id', wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id)
        res.render('recordstores/show', {recordstore})
    })
)

app.get('/recordstores/:id/edit', wrapAsync(async (req, res, next) => {
        const recordstore = await RecordStore.findById(req.params.id)
        res.render('recordstores/edit', {recordstore})
    })
)

app.put('/recordstores/:id', validationRS, wrapAsync(async (req, res, next) => {
        const {id} = req.params
        const recordstore = await RecordStore.findByIdAndUpdate(id, {...req.body.recordstore})
        res.redirect(`/recordstores/${recordstore._id}`)
    })
)

app.delete('/recordstores/:id', wrapAsync(async (req, res, next) => {
        const {id} = req.params;
        await RecordStore.findByIdAndDelete(id);
        res.redirect('/recordstores')
    })
)

app.post('/recordstores/:id/reviews', validationRev, wrapAsync(async (req, res, next) => {
    const recordstore = await RecordStore.findById(req.params.id);
    const review = new Review(req.body.review);
    recordstore.reviews.push(review);
    await review.save();
    await recordstore.save();
    res.redirect(`/recordstores/${recordstore._id}`);
    })
)

// Handling 404 issues
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

// Error handling which renders 'error' page and passes in error object to display custom error message to user
app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
