const express = require('express')
const router = express.Router()
const User = require('../models/user')
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
const passport = require('passport');

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register')
    })
    .post(wrapAsync(async (req, res) => {
        try {
            // Create new user
            const {username, email, password} = req.body
            const user = new User({email, username})
            // User.register takes user object and password. Password is hashed by passport.js
            const regUser = await User.register(user, password)
            req.flash('success', 'Welcome!')
            res.redirect('/recordstores')
        } catch (e) {
            req.flash('error', e.message)
            res.redirect('./register')
        }
    }))

router
    .route('/login')
    .get((req, res) => {
        res.render('auth/login')
    })
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: './login'}), (req, res) => {
        // Passport middleware handles authentication process
        req.flash('success', 'Welcome back!')
        res.redirect('/recordstores')
    })

module.exports = router

