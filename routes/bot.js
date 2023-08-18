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

// To handle the save
router.post('/edit-bot/:botId', async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.botId);
        if (!bot) {
            return res.status(404).send({ success: false, message: 'Bot not found' });
        }

        // Update fields (start with name, add more fields as needed)
        bot.name = req.body.name;
        bot.description = req.body.description;
        // bot.someOtherField = req.body.someOtherField;

        await bot.save();

        //res.send({ success: true });
        //res.redirect(`/edit-bot/${bot._id}?success=true`);
        res.redirect('/dashboard?success=true');

    } catch (error) {
        console.error(error);
        //res.status(500).send({ success: false, message: 'Failed to update bot' });
        res.redirect(`/edit-bot/${bot._id}?error=${encodeURIComponent('Your error message here')}`);

    }
});

// To render the edit bot page
router.get('/edit-bot/:botId', async (req, res) => {
    const bot = await Bot.findById(req.params.botId);
    if (!bot) {
        return res.status(404).send('Bot not found');
    }
    res.render('edit-bot', { bot });
});

module.exports = router;
