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
    console.log('message: logout' + req.user);
    req.logout();
    console.log(req.user);
    res.status(200).send({message:'loggedOut'});
})

router.get('/userlist',  auth.loggedIn, cntrlr.getUserlist);
router.delete('/removeUser', auth.loggedIn, cntrlr.removeUser);
router.patch('/toggleUserStatus', auth.loggedIn, cntrlr.toggleUserStatus);

router.post('/create_project', auth.loggedIn, cntrlr.create_project);
router.post('/get_projects', auth.loggedIn, cntrlr.get_projects);
router.post('/delete_project', auth.loggedIn, cntrlr.delete_project);
router.post('/rename_project', auth.loggedIn, cntrlr.rename_project);
router.post('/pro_name_exists', auth.loggedIn, cntrlr.pro_name_exists);
module.exports = router;