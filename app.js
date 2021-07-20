const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Join = require('joi');
const wrapAsync = require('./helpers/wrapAsync');
const ExpressError = require('./helpers/expressErr');
const methodOverride = require('method-override');
const RecordStore = require('./models/recordstore');
const Joi = require('joi');

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

app.post('/recordstores', wrapAsync(async (req, res, next) => {
        const recordstoreSchema = Joi.object({
            recordstore: Joi.object({
                title: Joi.string().required(),
                location: Joi.string().required(),
                image: Joi.string().required(),
                description: Joi.string().required()
            }).required()
        })
        const {error} = recordstoreSchema.validate(req.body)
        if(error){
            const errMsg = error.details.map(el => el.message).join(",")
            throw new ExpressError(errMsg, 500);
        }
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

app.put('/recordstores/:id', wrapAsync(async (req, res, next) => {
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

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
