const bcrypt = require('bcryptjs');
//const winston = require('winston')
const LocalStrategy = require('passport-local').Strategy;
const { db, pg, pool}=require('./api/db.js');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
		done(null, user.email)
	})

	passport.deserializeUser((username, cb) => {
        db.func('public.sp_getuserdata', ['user_byemail', [username]])
        .then(user => {
            cb(null, user[0])
        })
        .catch(err => {
            return cb(err);
        });
    })
    
    passport.use(new LocalStrategy(
        //{usernameField:'email', passwordField:'password'},
        (username, password, done) => {

        db.func('public.sp_getuserdata', ['user_byemail', [username]])
        .then(result => {
        if(result.length>0)
        {
            const first = result[0];
            bcrypt.compare(password, first.passward, function(err, res) {
                if(res) {
                    done(null, { email: first.email, userfname: first.f_name + ' ' + first.l_name, status: first.status, isadmin:first.isadmin })
                } else {
                    done(null, false)
                }
            })
        }
        else{
            done(null, false)
        }
        })
        .catch(err => {
            console.log('ERROR:', err); // print the error;
            return done(err);
        });
    }
    ))
}
