const express = require('express')
const router = express.Router()
// const User = require('../models/user')
const user = require('../controllers/users')
// custom function for handling errors in async functions
const wrapAsync = require('../helpers/wrapAsync');
const passport = require('passport');

router
    .route('/register')
    .get(user.renderNewUser)
    .post(wrapAsync(user.createNewUser))

router
    .route('/login')
    .get(user.renderLogin)
    // Passport middleware handles authentication process
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: './login'}), user.handleLogin)

router
    .route('/logout')
    .get(user.handleLogout)

module.exports = router

