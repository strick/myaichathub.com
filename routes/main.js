const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const router = express.Router();

router.get('/', (req, res) => {
    req.session.user = '';
    res.render('index', { title: 'My AI Chat Hub' });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {

    res.render('dashboard', { title: 'Dashboard - My AI Chat Hub', user: req.session.passport.user });
});

module.exports = router;
