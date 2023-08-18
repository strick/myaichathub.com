const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const User = require('../models/user');

console.log("Passport is using the following callback: " + process.env.FACEBOOK_APP_CALLBACK);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
    
    //req.session.user = profile; 

    // Find or create user in MongoDB using profile.id
    User.findOne({ facebookId: profile.id })
    .then(user => {
        if (user) {
            return done(null, user);
        } else {

            console.log(profile);

            const newUser = new User({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.email
            });
            newUser.save()
                .then(savedUser => done(null, savedUser))
                .catch(err => done(err));
        }
    })
    .catch(err => done(err));

}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, {id: id});
});

module.exports = passport;  // This line ensures we're exporting the passport module with our configuration.
