const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const Bot = require('../models/bot');

router.post('/create-bot', ensureAuthenticated, (req, res) => {

    let user = req.session.passport.user;

    const newBot = new Bot({
        name: req.body.name,
        createdBy: user._id
    });

    newBot.save()
        .then(bot => {
            res.redirect('/dashboard');  // or wherever you want to redirect after creating the bot
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        });
});

router.delete('/bot/:botId', ensureAuthenticated, async (req, res) => {

    // Check if user is logged in
    if (!req.user) {
        return res.status(401).send({ success: false, message: 'Unauthorized' });
    }

    try {
        const bot = await Bot.findById(req.params.botId);

        // Check if the bot exists and if the user is its creator
        if (!bot || String(bot.creatorUserId) !== String(req.user._id)) {
            return res.status(403).send({ success: false, message: 'Forbidden' });
        }

        // Delete the bot
        await Bot.findByIdAndDelete(req.params.botId);
        
        res.send({ success: true, message: 'Bot deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error deleting bot' });
    }
});


module.exports = router;
