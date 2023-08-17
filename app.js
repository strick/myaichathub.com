const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // assuming your templates are in a 'views' directory

// You can also set a default layout if you wish
app.set('layout', 'layout'); // this will be layout.ejs in your views directory

// Use express-ejs-layouts
app.use(ejsLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page to create a chatbot
app.get('/', (req, res) => {
    res.render('index', { title: 'My AI Chat Hub' });
});

// Route for the dashboard where users manage and train their bots
app.get('/dashboard', (req, res) => {
    // TODO: Add user authentication and display the user's bots.
    res.render('dashboard', { title: 'Dashboard - My AI Chat Hub' });
});

// Route to save the chatbot based on user prompt
app.post('/create-bot', (req, res) => {
    const { prompt, domain } = req.body;
    if (!prompt || !domain) {
        return res.status(400).send("Prompt and domain are required.");
    }
    
    const botData = {
        prompt,
        responses: [],
        domain
    };
    
    fs.writeFileSync(path.join(__dirname, 'bots', `${domain}.json`), JSON.stringify(botData));

    res.redirect('/dashboard');
});

// Start the server
app.listen(PORT, () => {
    console.log(`My AI Chat Hub is running on http://localhost:${PORT}`);
});
