const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const jwtsecretKey = require("../utils/token");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
    secretOrKey: jwtsecretKey, // Secret key for verifying token
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            if (jwt_payload) {
                return done(null, jwt_payload);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;
