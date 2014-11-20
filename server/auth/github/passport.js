var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var _ = require('lodash');

exports.setup = function (User, config) {
  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      passReqToCallback : true
    },
    function (req, accessToken, refreshToken, profile, done) {

      if (!req.user) {
        User.findOne({
            'github.id': profile.id
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                role: 'user',
                username: profile.username,
                provider: 'github',
                github: _.merge(profile._json, {token: accessToken})
              });
              user.save(function (err) {
                if (err) done(err);
                return done(err, user);
              });
            } else {
              return done(err, user);
            }
          })
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user.github = _.merge(profile._json, {token: accessToken});

        user.save(function (err) {
          if (err) done(err);
          return done(err, user);
        });
      }

    }
  ));
};
