const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const RecordStore = require('./models/recordstore');

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

app.get('/recordstores', async (req, res) => {
    const recordstore = await RecordStore.find({});
    res.render('recordstores/index', {recordstore})
})

app.get('/recordstores/new', async (req, res) => {
    res.render('recordstores/new');
})

app.post('/recordstores', async (req,res) => {
    const recordStore = new RecordStore(req.body.recordstore);
    await recordStore.save();
    res.redirect(`recordstores/${recordStore.id}`);
})

app.get('/recordstores/:id', async (req, res) => {
    const recordstore = await RecordStore.findById(req.params.id)
    res.render('recordstores/show', {recordstore})
})

app.get('/recordstores/:id/edit', async (req, res) => {
    const recordstore = await RecordStore.findById(req.params.id)
    res.render('recordstores/edit', {recordstore})
})

app.put('/recordstores/:id', async (req, res) => {
    const {id} = req.params
    const recordstore = await RecordStore.findByIdAndUpdate(id, {...req.body.recordstore})
    res.redirect(`/recordstores/${recordstore._id}`)
})

app.delete('/recordstores/:id', async (req,res) => {
    const {id} = req.params;
    await RecordStore.findByIdAndDelete(id);
    res.redirect('/recordstores')
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
