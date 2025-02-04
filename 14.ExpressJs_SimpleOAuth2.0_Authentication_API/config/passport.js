const User = require("../model/User")
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { googlecallbackURL, googleclientSecret, googleClientId } = require("../utils");


// Configure Passport Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: googleClientId,
            clientSecret: googleclientSecret,
            callbackURL: googlecallbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in the database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // If user exists, return the user
                    return done(null, user);
                } else {
                    // If user does not exist, create and save a new user
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,  // You can use other fields too
                        profileImage: profile.photos[0].value,
                    });

                    await user.save();  // Save new user to MongoDB
                    return done(null, user);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
module.exports=passport;