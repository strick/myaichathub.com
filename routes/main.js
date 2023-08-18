const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const router = express.Router();
const Bot = require('../models/bot');

router.get('/', (req, res) => {

    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    }

    req.session.user = '';
    res.render('index', { title: req.app.locals.siteName });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {

    let user = req.session.passport.user;

    Bot.find({ createdBy: user._id })
        .then(bots => {
            res.render('dashboard', { 
                title: 'Dashboard - ' + req.app.locals.siteName,
                user: user, bots: bots 
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        });
});


module.exports = router;
