const express = require('express');
const passport = require('../middleware/passport');
const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

/*
router.get('/logout', (req, res) => {
    req.logout(
        req.session.destroy(err => {
            if (err) {
                console.log("Error: Failed to destroy the session during logout.", err);
                return res.redirect('/errorPage'); // Or some error page
            }
            else {
                res.clearCookie('connect.sid');
                res.redirect('/');
            }
        })
    );
});
*/

router.get('/login', (req, res) => {
    res.redirect('/auth/facebook');
});

module.exports = router;
