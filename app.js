const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const RecordStore = require('./models/recordstore');

mongoose.connect('mongodb://localhost:27017/record-store', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
   
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/recordstores', async (req, res) => {
    const recordStores = await RecordStore.find({});
    res.render('recordstores/index', {recordStores})
})

app.get('/recordstores/:id', async(req, res) => {
    const recordstore = await RecordStore.findById(req.params.id)
    res.render('recordstores/show', {recordstore})
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
