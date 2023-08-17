const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const passport = require('./middleware/passport');
require('dotenv').config();
const session = require('express-session');

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

app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key used to sign the session ID cookie
    resave: false,                 // Forces session to be saved even when not modified
    saveUninitialized: true,       // Forces a session that is "uninitialized" to be saved to the store
}));

// If you're using passport, initialize it after the express-session middleware
app.use(passport.initialize());
app.use(passport.session());

// Use routes
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const botRoutes = require('./routes/bot');

app.use(authRoutes);
app.use(mainRoutes);
app.use(botRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`My AI Chat Hub is running on http://localhost:${PORT}`);
});