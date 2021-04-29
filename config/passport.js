const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/');
const { matchPassword } = require('../utils/password');
// passport.use(
//   new LocalStrategy(function (email, password, done) {
//     User.findOne({ email: email }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );

passport.use(
    new LocalStrategy(
        {
            usernameField: 'user[email]',
            passwordField: 'user[password]'
        },
        function (email, password, done) {
            User.findOne({ where: { email: email } })
                .then(async function (user) {
                    if (!user) {
                        return done(null, false, 'passport');
                    }
                    const passwordMatch = await matchPassword(
                        user.password,
                        password
                    );
                    if (!passwordMatch) {
                        return done(null, false, 'passport');
                    }

                    return done(null, user);
                })
                .catch(done);
        }
    )
);
