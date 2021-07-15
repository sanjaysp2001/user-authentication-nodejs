const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const config = require("./config");
const User = require("./models/user");

/*------------------------------Defining Local Strategy for Passport - Starts---------------------------------------*/
exports.local = passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*-------------------------------Defining Local Strategy for Passport - Ends--------------------------------------------------------------------------- */


//Function to Sign a JSON Web Token
exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

//Extract JWT from cookie
var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

//Options to use with JWT Strategy
var options = {};
options.jwtFromRequest = cookieExtractor;
options.secretOrKey = config.secretKey;

//Authenticates user using JWT
exports.jwtPassport = passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
