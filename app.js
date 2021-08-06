const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// ejsMate used for layout and partials in views
const ejsMate = require('ejs-mate');
// extension of Error class, allows a custom error and http response code to be passed to error handling middleware
const ExpressError = require('./helpers/expressErr');
const methodOverride = require('method-override');

const recordstores = require('./routes/recordstores')

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

app.use("/recordstores", recordstores)

app.get('/', (req, res) => {
    res.render('home')
})

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
