const express = require('express');
const router = express.Router();
var cntrlr = require('../controller/user_controller');
const passport = require('passport');
const auth = require('./Auth.js');


router.post('/signup', cntrlr.user_signup);
router.post('/login',  passport.authenticate('local'), cntrlr.user_login);
router.post('/forgot', cntrlr.pw_forgot);
router.post('/reset', cntrlr.pw_reset);
router.get('/logout', (req, res)=>{
    req.logout();
    console.log('message: logout');
    console.log(req.user);
    res.status(200).send({message:'loggedOut'});
})

router.get('/userlist',  auth.loggedIn, cntrlr.getUserlist);
router.delete('/removeUser', auth.loggedIn, cntrlr.removeUser);
router.patch('/toggleUserStatus', auth.loggedIn, cntrlr.toggleUserStatus);


module.exports = router;