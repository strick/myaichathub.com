const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const passport = require('./middleware/passport');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const DB_CONNECTION = "";


if(process.env.ENV == 'dev'){
    DB_CONNECTION = process.env.DB_CONNECTION;
}
else {
    
    DB_CONNECTION = `${process.env.DBTYPE}://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}/${process.env.DBNAME}?retryWrites=true&w=majority`
}
 
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('MongoDB connection error:', error);
});

const app = express();
const PORT = process.env.PORT || 3000;

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    })
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