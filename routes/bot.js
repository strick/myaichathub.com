const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/create-bot', (req, res) => {
    const { prompt, domain } = req.body;
    if (!prompt || !domain) {
        return res.status(400).send("Prompt and domain are required.");
    }
    
    const botData = {
        prompt,
        responses: [],
        domain
    };
    
    fs.writeFileSync(path.join(__dirname, '..', 'bots', `${domain}.json`), JSON.stringify(botData));

    res.redirect('/dashboard');
});

module.exports = router;
