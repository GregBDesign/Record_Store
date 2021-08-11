const express = require('express')
const router = express.Router()
const User = require('../models/user')

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register')
    })
    .post((req, res) => {
        res.send(req.body)
    })

module.exports = router

