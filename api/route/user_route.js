const express = require('express');
const router = express.Router();
var cntrlr = require('../controller/user_controller');
var imprt_cntrlr = require('../controller/import_controller');
const passport = require('passport');
const auth = require('./Auth.js');
const multer = require('multer');


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

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files')
    },
    filename: function(req, file, cb) {
        console.log(file);
        req.myfilename = file.originalname.toLowerCase();
        cb(null, file.originalname);
        //cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    });
const upload = multer({ storage : storage });   
router.route('/fileupload').post(upload.any(), auth.loggedIn, imprt_cntrlr.fileuploaddprocess);
module.exports = router;