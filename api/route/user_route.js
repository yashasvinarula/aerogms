const express = require('express');
const router = express.Router();
var cntrlr = require('../controller/user_controller');
const passport = require('passport');
const auth = require('./Auth.js');


router.post('/signup', cntrlr.user_signup);
router.post('/login',  passport.authenticate('local'), cntrlr.user_login);
router.get('/forgot', cntrlr.pw_forgot);
router.post('/reset', cntrlr.pw_reset);

router.get('/test', auth.loggedIn, function(req, res){
    res.status(200).send({message:'You are logged in'});
});

module.exports = router;