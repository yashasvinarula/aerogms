const express = require('express');
const router = express.Router();
var cntrlr = require('../controller/user_controller');
var imprt_cntrlr = require('../controller/import_controller');
var layer_cntrlr = require('../controller/layer_controller');
const passport = require('passport');
const auth = require('./Auth.js');9
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
router.post('/get_layers', auth.loggedIn, layer_cntrlr.get_layers)
router.post('/create_layer', auth.loggedIn, layer_cntrlr.create_layer);
router.post('/rename_layer', auth.loggedIn, layer_cntrlr.rename_layer);
router.post('/lay_name_exists', auth.loggedIn, layer_cntrlr.lay_name_exists);
router.get('/lay_stats_dne', layer_cntrlr.lay_stats);
router.post('/delete_layer', auth.loggedIn, layer_cntrlr.delete_layer);
router.post('/layer_attribute', auth.loggedIn, layer_cntrlr.layer_attribute);
router.post('/delete_column', auth.loggedIn, layer_cntrlr.delete_column);
router.post('/rename_column', auth.loggedIn, layer_cntrlr.rename_column);
router.post('/add_column', auth.loggedIn, layer_cntrlr.add_column);
router.post('/get_bound', auth.loggedIn, layer_cntrlr.get_bound);
router.post('/layer_col_update', layer_cntrlr.layer_col_update)
router.post('/exis_layer_insert', auth.loggedIn, layer_cntrlr.exis_layer_insert);
router.post('/update_layer_color', auth.loggedIn, layer_cntrlr.update_layer_color);
router.post('/update_layer_attrib', auth.loggedIn, layer_cntrlr.update_layer_attrib);

router.post('/getmsevaToken', cntrlr.getmsevaToken);

/*for mobile user*/
//-----------------------------
router.post('/m_signup', cntrlr.m_signup); 
router.post('/m_signin', cntrlr.m_signin);
router.get('/m_getprofile', cntrlr.m_getprofile);
router.post('/m_updateprofile', cntrlr.m_updateprofile);
router.post('/m_submitPoint', cntrlr.m_submitPoint);
router.post('/m_getPoly', cntrlr.m_getPoly);
router.post('/m_getPolyPoints', cntrlr.m_getPolyPoints);
router.post('/m_getPolyPointsById', cntrlr.m_getPolyPointsById);
router.post('/m_updatePolyPointsById', cntrlr.m_updatePolyPointsById);

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
router.post('/deletelayer', imprt_cntrlr.deletelayer);

module.exports = router;