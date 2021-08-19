const User = require('../models/user')

module.exports.renderNewUser = (req, res) => {
    res.render('auth/register')
}

module.exports.createNewUser = async (req, res, next) => {
    // Next is called as req.login doesn't support async as call back required
    try {
        // Create new user
        const {username, email, password} = req.body
        const user = new User({email, username})
        // User.register takes user object and password. Password is hashed by passport.js
        const regUser = await User.register(user, password)
        req.login(regUser, e => {
            if(e) next(e)
            req.flash('success', 'Welcome!')
            res.redirect('/recordstores')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('./register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login')
}

module.exports.handleLogin = (req, res) => {
    req.flash('success', 'Welcome back!')
    let redirectTo = req.session.URLaccess || '/recordstores'
    delete req.session.URLaccess
    res.redirect(redirectTo)
}

module.exports.handleLogout = (req, res) => {
    req.logout()
    req.flash('success', 'You are now logged out')
    res.redirect('/recordstores')
}