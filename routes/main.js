const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const router = express.Router();

router.get('/', (req, res) => {
    req.session.user = '';
    res.render('index', { title: req.app.locals.siteName });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {

    res.render('dashboard', { title: 'Dashboard - My AI ChatHub', user: req.session.passport.user });
});

module.exports = router;
