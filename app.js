require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
// ejsMate used for layout and partials in views
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
// extension of Error class, allows a custom error and http response code to be passed to error handling middleware
const ExpressError = require('./helpers/expressErr')
const methodOverride = require('method-override')
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')

const recordstores = require('./routes/recordstores')
const reviews = require('./routes/reviews')
const users = require('./routes/users')

mongoose.connect('mongodb://localhost:27017/record-store', 
    {useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
   
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
    });

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'greatSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
// Store and unstore user in a session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Flash middleware
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use("/recordstores", recordstores)
app.use("/recordstores/:id/reviews", reviews)
app.use("/users", users)

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
