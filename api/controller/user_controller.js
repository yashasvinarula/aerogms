const { db, pg, pool}=require('../db.js');
const bcrypt = require('bcryptjs');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require("fs");
const path = require('path');
const config = require('../../config/config');
const request = require("request");
var json2xls = require('json2xls');
var excelFile = 'undefined';
var geojsonFile = 'undefined';

module.exports.exportExcel =function(req, res)
{
    console.log('In download excel');
    console.log(req.body.layer_name);
    if(excelFile !== 'undefined') {
        var filepath = path.join(__dirname,  `../../aerogms/build/${excelFile}`);
        fs.unlink(filepath, (err) => {
            if(err) {
                console.error(err);
            }
        });
    }
        db.any(`select * from ${req.body.layer_name};`)
        .then(result=>{
            if(result.length>0)
            {
                var xlsx = json2xls(result);
                var fileName = `exceldata${new Date().getTime()}.xlsx`;
                excelFile = fileName;
                fs.writeFileSync(path.join(__dirname,  `../../aerogms/build/${fileName}`), xlsx, 'binary');
                console.log('excel created');
                    res.status(200).json({message : 'File created successfully', filename : fileName});
            }
        }).
        catch(error=>{
            console.log(err);
            res.status(500).send('Error in fetching records!');
        })
}
module.exports.exportGeoJson = (req, res) => {
    console.log('In download geojson');
    if(geojsonFile !== 'undefined') {
        var filepath = path.join(__dirname,  `../../aerogms/build/${geojsonFile}`);
        fs.unlink(filepath, (err) => {
            if(err) {
                console.error(err);
            }
        });
    }
    db.any(`select * from ${req.body.layer_name};`)
        .then(result=>{
            if(result.length>0)
            {
                var resultKeys = [];
                resultKeys.push(Object.keys(result[0]));
                var rindex = resultKeys[0].indexOf('geom');
                resultKeys[0].splice(rindex, 1);
                console.log(`Keys in result are ${resultKeys}`);
                var valueString = resultKeys.toString();
                var queryStr = `select row_to_json(fc) from 
                (select 'FeatureCollection' as "type",  array_to_json(array_agg(f)) as "features" from 
                (select 'Feature' as "type", ST_AsGeoJSON(geom, 6) :: json as "geometry",(select json_strip_nulls(row_to_json(t)) 
                from (select ${valueString}) t ) as "properties" from ${req.body.layer_name} limit 500) as f) as fc;`
                db.any(queryStr)
                .then((data) => {
                console.log(data);
                var fileName = `geojson${new Date().getTime()}.json`;
                geojsonFile = fileName;
                var newjson = JSON.stringify(data[0].row_to_json);
                fs.writeFileSync(path.join(__dirname,  `../../aerogms/build/${fileName}`), newjson);
                    res.setHeader('Content-disposition', 'attachment; filename= myFile.json');
                    res.setHeader('Content-type', 'application/json');
                    res.send(newjson);
                })
                .catch((err) =>{
                    console.log(err);
                    res.status(500).send('Error in downloading file');
            });
            }
        }).
        catch(error=>{
            console.log(err);
            res.status(500).send('Error in fetching records!');
        })
}

module.exports.user_signup =  function(req, res){

    let valArr =[];
    if(req.body.firstName != "" && req.body.firstName != undefined ){
        valArr.push(req.body.firstName?req.body.firstName:null);
        valArr.push(req.body.lastName);
        valArr.push(req.body.email);
        valArr.push(req.body.mobile);
        let pw = bcrypt.hashSync(req.body.password, 10)
        valArr.push(pw);
    }
    else
    {
        return res.status(401).send({message:'Please fill all the fields!'});
    }
    
    if(valArr.length == 5)
    {
        db.func('public.sp_aerogms', ['user_existance', [valArr[2]]])
        .then(
            result => {
        if(result[0].sp_aerogms)
        {
            console.log(result[0].sp_aerogms);
            return res.status(200).send({message:'Email exists'});
        }
        else
        {
            db.func('public.sp_aerogms', ['user_regist', valArr])
            .then(result2 => {
            if(result2[0].sp_aerogms)
            {
                console.log(result2[0].sp_aerogms);
                let from = config.secdata.mail_id;//process.env.mail_id;
                let to = req.body.email;
                let sub = 'AeroGMS account confirmation';
                let content ='Welcome to AeroGMS Family.\n\n' + 
                'Thank you for showing your interest in AeroGMS.\n\n'+
                'Your account will be activate very soon and confirmation mail will be received by you.\n\n';
                let message = 'Your account has been created successfully.';
                sendMail(req, res, from, to, sub, content, message);
                //return res.status(200).send({message:result2[0].sp_aerogms});
            }
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.status(400).send(error);
            });
        }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            return res.status(400).send(error);
        });
    }
  // pool.query('select * from user_info;', (err, result) => {
    //     if (err) {
    //         console.error('Error executing query', err.stack);
    //         return res.status(400).send(err);
    //     }
    //     console.log(result.rows[0].name)
    //     return res.status(200).json(result.rows);
    //   })

    // (async function(){
    //     const client = await pool.connect();
    //     const result = await client.query('select * from user_info;');
    //     return res.status(200).json(result.rows);
    //     client.release();
    //   })().catch(err=>{
    //     return res.status(400).send(err);
    // })

    // pool.connect(client=>{
    //     client.query('select * from user_info;')
    //     .then(result=>{
    //         client.release();
    //         console.log(result.rows);
    //         return res.status(200).json(result.rows);
    //         })
    //     .catch(err=>{
    //         client.release();
    //         console.log(err);
    //         return res.status(400).send(err);
    //     })
    // })
    // console.log('All right');
    // res.status(200).json({message:'all right!'});
}

module.exports.user_login = function(req, res){
    console.log('in login');
    console.log(req.session);
    //req.session.user = req.user.email;
    return res.status(200).send(req.user);
}

module.exports.user_pwchange_req = function(req, res)
{
    const email = req.body.email;

    db.func('public.sp_aerogms', ['user_existance', [email]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        console.log(result[0].sp_aerogms);
        return res.status(200).send({message:'Email exists'});
    }
    else
    {
        return res.status(401).send({message:'Email id not exists!'});
    }
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
});
}

module.exports.pw_reset = async function(req, res){
    const token = req.body.token.trim();
    const npw = req.body.newPassword.trim();
    if(token && npw)
    {
        const hashnpw = await bcrypt.hashSync(npw, 10);

        db.func('public.sp_gettokenstatus', ['token_existance', [token]])
        .then(result => {
        if(result[0])
        {
            let flag = Date.now() <= (result[0].f_token_date + 24*3600000);

            if(flag){

                //return res.status(200).send({email:result[0].email});
                db.func('public.sp_aerogms', ['pw_change', [result[0].email, hashnpw]])
                .then(result => {
                if(result[0].sp_aerogms)
                {
                    console.log(result[0].sp_aerogms);
                    return res.status(200).send({message:'Password has been changed successfully.'});
                }
                else
                {
                    return res.status(401).send({message:'Token has expired after 24 hours! Please try again!'});
                }
                })
                .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.status(400).send(error);
                });

            }
            else{
                return res.status(410 ).send({message:'Token is expired! Please try again and generate new token!!'});
            }
        }
        else{
            return res.status(400).send({message:'Token is incorrect! Please try again!!'});
        }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            return res.status(400).send(error);
        });
    }
    else{
        console.log('Please enter correct values!');
        return res.status(400).send({message:'Please enter correct values!'});
    }
}

module.exports.pw_forgot = async function(req, res) {
        var mailId = req.body.email;
        if(mailId == "" || mailId == undefined)
        {
            return res.status(401).send({message:'Email id should not be empty!'});
        }
        var token = await Math.floor(100000 + Math.random() * 900000).toString();
        db.func('public.sp_aerogms', ['user_existance', [mailId]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            console.log('forgot user exist ' + result[0].sp_aerogms);
            let time =Date.now();
            db.func('public.sp_aerogms', ['token_update', [mailId, token, time.toString()]])
            .then(result => {
            if(result[0].sp_aerogms)
            {
                console.log(result[0].sp_aerogms);
                let from = config.secdata.mail_id;;
                let to = req.body.email;
                let sub = 'AeroGMS Password Reset Token';
                let content ='You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please insert the following token, into web page  :\n\n' +
                '<p style="font-weight: bold; font-size:20px; color: #666;">' + token +'</p>' +'\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n';
                let message = `An e-mail has been sent to ${req.body.email} with further instructions.`;
                sendMail(req, res, from , to, sub, content, message);
                //return res.status(200).send({message:'Email exists'});
            }
            else
            {
                console.log('token is not updated!');
            }
            //done(token);
            //done('err', token, 'user');
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.status(400).send(error);
            });
        }
        else
        {
            return res.status(400).send({message:'Email id not exists!'});
        }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            return res.status(400).send(error);
        });
  }

function sendMail(req, res, from, to, sub, content, message) {
    var smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'elevenx099@gmail.com',
        pass: 'enbenb@123'
      }
    });
    var mailOptions = {
      to: to,//req.body.email,//req.headers.host, //
      from: from,
      subject: sub,
      html: content
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err)
        {
            console.log('error in mail sending ' + err);
        }
        return res.status(200).send({message:message});
        // if(from === 'aerogmsdeveloper@gmail.com')
        // {
        //     console.log('mail send from aerogmsdeveloper@gmail.com to ' + to);
        // }
        // else
        // {
        //     return res.status(200).send({message:message});
        // }
    });
  }

module.exports.getUserlist = function(req, res){
   
    db.func('public.sp_getuserslist', ['userlist', 0])
    .then(result => {
    if(result)
    {
        console.log(result[0].sp_aerogms);
        return res.status(200).send(result);
    }
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
});
}   

module.exports.removeUser = function(req, res){
    //has to implement....................
    db.func('public.sp_aerogms', ['remove_user', [req.query.u_id]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        console.log(result[0].sp_aerogms);
        return res.status(200).send({u_id:result[0].sp_aerogms});
        //return res.status(200).send({message:'User removed successfully!'});
    }
    else
    {
        return res.status(500).send({status:'fail', message:'User already removed!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}

module.exports.toggleUserStatus = function(req, res){

    db.func('public.sp_aerogms', ['toggle_user_status', [req.body.u_id]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        let retVal = result[0].sp_aerogms.split('#');
        console.log(result[0].sp_aerogms);
        if(retVal[0] == "true"){
            let from = config.secdata.mail_id;
            let to = retVal[1];
            let sub = 'AeroGMS account Activation Status';
            let content ='Welcome to AeroGMS Family.\n\n' + 
            'Your account has been activated. Now you can login.\n\n';
            let message = req.body.u_id;//'Your account has been activated successfully.';
            sendMail(req, res, from, to, sub, content, message);
        }
        else{
            let from = config.secdata.mail_id;;
            let to = retVal[1];
            let sub = 'AeroGMS account Activation Status';
            let content = 'Your account has been de-activated. Now you can not login. For more details contact to admin.\n\n';
            let message = req.body.u_id;//'Your account has been de-activated successfully.';
            sendMail(req, res, from, to, sub, content, message);
        }
        //return res.status(200).send({status:result[0].sp_aerogms});
    }
    else
    {
        console.log('Problem in status toggling');
        return res.status(500).send({status:'fail', message:'Problem in status toggling'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
    }

module.exports.create_project = function(req, res){
        db.func('public.sp_aerogms', ['create_project', [req.body.pro_name, req.body.owner_email]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            console.log(result[0].sp_aerogms);
            let date_time =new Date().toLocaleString();//new Date().toString().replace(/T/, ' ').replace(/\..+/, '');
            return res.status(200).send({pro_id:result[0].sp_aerogms,pro_name:req.body.pro_name, date_time:date_time});
        }
        else
        {
            return res.status(500).send({status:'fail', message:'Problem in creating new project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send({status:'error', message:error.message});
        });
}

module.exports.get_projects = function(req, res){
        db.func('public.sp_getprojectlist', [req.body.owner_email])
        .then(result => {
        if(result)
        {
            return res.status(200).send(result);
        }
        else
        {
            return res.status(500).send({status:'fail', message:'Problem in fetching project list!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send({status:'error', message:error.message});
        });
    }

module.exports.delete_project = function(req, res){
        db.func('public.sp_aerogms', ['delete_project', [req.body.pro_id.toString()]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            return res.status(200).send(result[0].sp_aerogms);
        }
        else
        {
            return res.status(500).send({status:'fail', message:'Problem in deleting project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send({status:'error', message:error.message});
        });
    }

module.exports.rename_project = function(req, res){
        db.func('public.sp_aerogms', ['rename_project', [req.body.pro_id.toString(), req.body.pro_name]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            return res.status(200).send({pro_id:result[0].sp_aerogms, pro_name:req.body.pro_name});
        }
        else
        {
            return res.status(500).send({status:'fail', message:'Problem in renaming project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send({status:'error', message:error.message});
        });
    }

module.exports.pro_name_exists = function(req, res){
        db.func('public.sp_aerogms', ['pro_name_exists', [req.body.pro_name, req.body.owner_email]])
        .then(result => {
        if(result[0])
        {
            return res.status(200).send({pro_id:result[0].sp_aerogms});
        }
        else
        {
            return res.status(200).send({message:'Problem in checking project name!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
        });
    }

//---------mobile---------------

module.exports.m_signup =  function(req, res){
    let valArr =[];
    if(req.body.kuchbhi)
    {
        let jsonarr = JSON.parse(req.body.kuchbhi); 

        if(jsonarr.acc_type === 'google')
        {
            valArr.push(jsonarr.fname);
            valArr.push(jsonarr.lname);
            valArr.push(jsonarr.email);
            valArr.push(jsonarr.mobile ? jsonarr.mobile : '0');
            let pw = bcrypt.hashSync(jsonarr.pw, 10)
            valArr.push(pw);
            valArr.push(jsonarr.photo);
        
        if(valArr.length == 6)
        {
            db.func('public.sp_aerogms', ['m_user_existance', [valArr[2]]])
            .then(
                result => {
            if(result[0].sp_aerogms)
            {
                return res.send({status:'exists',message:'Email id is already exists!'});
            }
            else
            {
                db.func('public.sp_aerogms', ['m_user_regist', valArr])
                .then(result2 => {
                if(result2[0].sp_aerogms)
                {
                    console.log(result2[0].sp_aerogms);
                    let from = 'aerogmsdeveloper@gmail.com';//process.env.mail_id;
                    let to = jsonarr.email;
                    let sub = 'AeroGMS Measure account confirmation';
                    let content ='Welcome to AeroGMS Family.\n\n' + 
                    'Thank you for showing your interest in AeroGMS.\n\n' + 
                    'User Id: '+ jsonarr.email +'\n'+
                    'Password: '+ jsonarr.pw +'\n\n';
                    let message = 'Your account has been created successfully.';
                    sendMailForMobile(req, res, from, to, sub, content, message, function(err, status){
                        if(err && !status)
                        {
                            return res.send({status:'success', message:'Account created successfully but there is problem in sending confirmation mail.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:jsonarr.photo,fname:jsonarr.fname, lname:jsonarr.lname, mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                        }
                        return res.send({status:'success', message:'Account created successfully.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:jsonarr.photo,fname:jsonarr.fname, lname:jsonarr.lname, mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                    });
                }
                })
                .catch(error => {
                    console.log('ERROR:', error); // print the error;
                    if(error.constraint === 'mobile_user_uk_mobile')
                    {
                        return res.send({status:'error', message:'Mobile number already registered!'});
                    }
                    else
                    {
                        return res.send({status:'error', message:error});
                    }
                });
            }
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.send({status:'error', message:error});
            });
        }
        }
        else if(jsonarr.acc_type === 'aerogms')
        {
            valArr.push(jsonarr.fname);
            valArr.push(jsonarr.lname);
            valArr.push(jsonarr.email);
            valArr.push(jsonarr.mobile ? jsonarr.mobile : '0');
            let pw = bcrypt.hashSync(jsonarr.pw, 10)
            valArr.push(pw);
            const imageloc = '/images/m_profile/'+ `${jsonarr.email}.png`;
            var imageDirloc = path.join(__dirname, '../../aerogms/public/images/m_profile/');
            var base64Data = jsonarr.photo.replace(/^data:image\/png;base64,/, "");
            var photo_path = `${imageDirloc}${jsonarr.email}.png`;

                db.func('public.sp_aerogms', ['m_user_existance', [valArr[2]]])
                .then(result => {
                if(result[0].sp_aerogms)
                {
                    return res.send({status:'exists',message:'Email id is already exists!'});
                }
                else
                {
                    if(base64Data)
                    {
                        valArr.push(imageloc);
                        fs.writeFile(photo_path, base64Data, 'base64', function(err) {
                            if(err){
                                return res.send({status:'fail',message:'Image is not valid!'});
                            }
                            else
                            {
                                if(valArr.length == 6)
                                {
                                    db.func('public.sp_aerogms', ['m_user_regist', valArr])
                                    .then(result2 => {
                                    if(result2[0].sp_aerogms)
                                    {
                                        console.log(result2[0].sp_aerogms);
                                        let from = 'aerogmsdeveloper@gmail.com';//process.env.mail_id;
                                        let to = jsonarr.email;
                                        let sub = 'AeroGMS Measure account confirmation';
                                        let content ='Welcome to AeroGMS Family.\n\n' + 
                                        'Thank you for showing your interest in AeroGMS.\n\n' + 
                                        'User Id: '+ jsonarr.email +'\n'+
                                        'Password: '+ jsonarr.pw +'\n\n';
                                        let message = 'Your account has been created successfully.';
                                        sendMailForMobile(req, res, from, to, sub, content, message, function(err, status){
                                            if(err && !status)
                                            {
                                                return res.send({status:'success', message:'Account created successfully.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:imageloc,fname:jsonarr.fname, lname:jsonarr.lname, mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                                            }
                                            return res.send({status:'success', message:'Account created successfully.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:imageloc,fname:jsonarr.fname, lname:jsonarr.lname, mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                                        });
                                        
                                    }
                                    })
                                    .catch(error => {
                                        console.log('ERROR:', error); // print the error;
                                        if(error.constraint === 'mobile_user_uk_mobile')
                                        {
                                            fs.unlinkSync(photo_path);
                                            return res.send({status:'error', message:'Mobile number already registered!'});
                                        }
                                        else
                                        {
                                            return res.send({status:'error', message:error});
                                        }
                                    });
                                }           
                            }
                    });
                    }
                    else
                    {
                        valArr.push('');
                        if(valArr.length == 6)
                        {
                            db.func('public.sp_aerogms', ['m_user_regist', valArr])
                            .then(result2 => {
                            if(result2[0].sp_aerogms)
                            {
                                console.log(result2[0].sp_aerogms);
                                

                                let from = 'aerogmsdeveloper@gmail.com';//process.env.mail_id;
                                        let to = jsonarr.email;
                                        let sub = 'AeroGMS Measure account confirmation';
                                        let content ='Welcome to AeroGMS Family.\n\n' + 
                                        'Thank you for showing your interest in AeroGMS.\n\n' + 
                                        'User Id: '+ jsonarr.email +'\n'+
                                        'Password: '+ jsonarr.pw +'\n\n';
                                        let message = 'Your account has been created successfully.';
                                        sendMailForMobile(req, res, from, to, sub, content, message, function(err, status){
                                            if(err && !status)
                                            {
                                                return res.send({status:'success', message:'Account created successfully.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:'/images/m_profile/default.png', fname:jsonarr.fname, lname:jsonarr.lname,mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                                            }
                                            return res.send({status:'success', message:'Account created successfully.', data:{uid:result2[0].sp_aerogms, email:jsonarr.email, photo:'/images/m_profile/default.png', fname:jsonarr.fname, lname:jsonarr.lname,mobile:jsonarr.mobile, acc_type:jsonarr.acc_type}});
                                        });
                            }
                            })
                            .catch(error => {
                                console.log('ERROR:', error); // print the error;
                                if(error.constraint === 'mobile_user_uk_mobile')
                                {
                                    fs.unlinkSync(photo_path);
                                    return res.send({status:'error', message:'Mobile number already registered!'});
                                }
                                else
                                {
                                    return res.send({status:'error', message:error});
                                }
                            });
                        }
                    }
                }
                })
                .catch(error => {
                    console.log('ERROR:', error); // print the error;
                    return res.send({status:'error', message:error});
                });
            }
            else
            {
                return res.send({status:'fail', message:'Please enter valid account type!'});
            }
    }
    else
    {
        return res.send({message:'Please fill all the required fields!'});
    }
}
module.exports.m_signin = function(req, res){
    let userjsdata;
    if(req.body.kuchbhi)
    {
        userjsdata = JSON.parse(req.body.kuchbhi);
        let uname = userjsdata.email.length > 0 ? userjsdata.email: '';
        let upw = userjsdata.pw.length > 0 ? userjsdata.pw : '';

        if(uname && upw)
        {
            db.func('public.sp_aerogms', ['m_user_signin', [uname]])
            .then(result => {
            if(result[0].sp_aerogms)
            {
                const hpw = result[0].sp_aerogms;
                bcrypt.compare(upw, hpw, function(err, result) {
                    if(!err && result) {
                        console.log('Logged in successfully!');
                        db.func('public.sp_m_getuserdata', [uname.toString()])
                        .then(result2 => {
                        if(result2)
                        {
                            console.log(result2);
                            return res.send({status:'success', message:'Logged in successfully!', data:{uid:result2[0].uid, email:result2[0].email, photo:result2[0].photo, fname:result2[0].f_name, lname:result2[0].l_name,mobile:result2[0].mobile_user}});
                        }
                        })
                        .catch(error => {
                            return res.send({status:'error', message:error});
                        });
                        //return res.send({status:'success', message:'Logged in successfully.'});
                    } else {
                        console.log('Please enter valid password!');
                        return res.send({status:'fail', message:'Please enter valid password!'});
                    }
                })
            }
            else
            {
                console.log('Please enter valid username!');
                return res.send({status:'fail', message:'Please enter valid username!'});
            }
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.send({status:'error', message:error.messgae});
            });
        }
        else{
            console.log('enter valid credentials');
            return res.send({message:'Please enter valid credentials!'});
        }
    }
    else
    {
        console.log('fill all the required fields!');
        return res.send({message:'Please fill all the required fields!'});
    }
}
module.exports.m_getprofile = function(req, res){
    if(req.query.email)
    {
        //var userjsdata = JSON.parse(req.query.email);
        let uname = req.query.email.length > 0 ? req.query.email: '';
        if(uname)
        {
            db.any('SELECT u_id, f_name, l_name, email, mobile, passward, photo, date_time, status, profession, website, street, city, state, pincode, country FROM public.mobile_user where email=$1', [uname.toString()])
            .then((result2) =>{
                if(result2.length>0)
                {
                    console.log(result2);
                    return res.send({status:'success', message:'Profile data is fetch successfully!', data:{uid:result2[0].uid, email:result2[0].email, photo:result2[0].photo, fname:result2[0].f_name, lname:result2[0].l_name,mobile:result2[0].mobile, website:result2[0].website, street:result2[0].street, city:result2[0].city, state:result2[0].state, pincode:result2[0].pincode, country:result2[0].country, profession:result2[0].profession}});
                }
                else
                {
                    return res.send({status:'fail', message:'no records found!'});
                }
            })
            .catch(error => {
                return res.send({status:'error', message:error});
            });

            // db.func('public.sp_m_getuserdata', [uname.toString()])
            // .then(result2 => {
            // if(result2)
            // {
            //     console.log(result2);
            //     return res.send({status:'success', message:'Profile data is fetch successfully!', data:{uid:result2[0].uid, email:result2[0].email, photo:result2[0].photo, fname:result2[0].f_name, lname:result2[0].l_name,mobile:result2[0].mobile, website:result2[0].website, street:result2[0].street, city:result2[0].city, sytate:result2[0].state, pincode:result2[0].pincode, country:result2[0].country, profession:result2[0].profession}});
            // }
            // })
            // .catch(error => {
            //     return res.send({status:'error', message:error});
            // });
        }
        else{
            console.log('enter valid credentials');
            return res.send({message:'Please enter valid email!'});
        }
    }
    else
    {
        console.log('please send email id!');
        return res.send({message:'Please send email id!'});
    }
}
module.exports.m_updateprofile = function(req, res){
    let valArr =[];
    if(req.body.kuchbhi)
    {
        var jsonarr = JSON.parse(req.body.kuchbhi);
        valArr.push(jsonarr.data.fname);
        valArr.push(jsonarr.data.lname);
        valArr.push(jsonarr.data.mobile ? jsonarr.data.mobile : '0');
        valArr.push(jsonarr.data.profession);
        valArr.push(jsonarr.data.website);
        valArr.push(jsonarr.data.street);
        valArr.push(jsonarr.data.city);
        valArr.push(jsonarr.data.state);
        valArr.push(jsonarr.data.pincode);
        valArr.push(jsonarr.data.country);
        if(jsonarr.data.photo === "")
        {
            valArr.push("");
            valArr.push(jsonarr.email);
            db.func('public.sp_aerogms', ['m_updateprofile', valArr])
            .then(result=> {
            if(result[0].sp_aerogms)
            {
                console.log(result[0].sp_aerogms);
                return res.send({status:'success', message:'Profile Updated successfully.'});
            }
            else{
                return res.send({status:'fail', message:'Problem in profile updation.'});
            }
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
                return res.send({status:'error', message:error});
            });
        }
        else{
            const imageloc = '/images/m_profile/'+ `${jsonarr.email}.png`;
            var imageDirloc = path.join(__dirname, '../../aerogms/public/images/m_profile/');
            var base64Data = jsonarr.data.photo.replace(/^data:image\/png;base64,/, "");
            var photo_path = `${imageDirloc}${jsonarr.email}.png`;
            if(base64Data)
            {
                fs.writeFile(photo_path, base64Data, 'base64', function(err) {
                    if(err){
                        return res.send({status:'fail',message:'Image is not valid!'});
                    }
                    else
                    {
                        valArr.push(imageloc);
                        valArr.push(jsonarr.email);
                        db.func('public.sp_aerogms', ['m_updateprofile', valArr])
                        .then(result2 => {
                        if(result2[0].sp_aerogms)
                        {
                            console.log(result2[0].sp_aerogms);
                            return res.send({status:'success', message:'Profile updated successfully.'});
                        }
                        })
                        .catch(error => {
                            return res.send({status:'error', message:error});
                        });
                    }
                });
            }
        }
    }
    else
    {
        console.log('please send all fields!');
        return res.send({message:'Please send all fields'});
    }
}
module.exports.m_submitPoint = function(req, res){
    if(req.body.kuchbhi)
    {
        let jsonarr = JSON.parse(req.body.kuchbhi);
        let polyInfo = jsonarr.poly ? jsonarr.poly : '';
        let pointInfo =  jsonarr.point ? jsonarr.point : '';
        let email = jsonarr.email ? jsonarr.email : '';

        if(polyInfo && pointInfo && email)
        {
            if(polyInfo.geometry != '' && polyInfo.id == '')
            {
                db.any('INSERT INTO public.mobile_poly(type, geometry, email) VALUES($1, $2, $3) returning aerogmsid;', [polyInfo.type.toString(), polyInfo.geometry.toString(), email.toString()])
                .then((result2) =>{
                    if(result2.length>0)
                    {
                        console.log(result2);
                        //return res.send({status:'success', id:result2[0].aerogmsid});
                        var imagedate = new Date();
                        var timeStamp = imagedate.getTime();
                        var imageloc = '/images/m_profile/'+ `${timeStamp}.png`;
                        var imageDirloc = path.join(__dirname, '../../aerogms/public/images/m_profile/');
                        var base64Data = pointInfo.photo.replace(/^data:image\/png;base64,/, "");
                        var photo_path = `${imageDirloc}${timeStamp}.png`;
                        if(base64Data == '')
                        {
                            db.any('INSERT INTO public.mobile_poly_points(poly_id, name, descrip, photo, geom, email) VALUES($1::integer, $2, $3, $4,ST_SetSRID(st_makepoint($5::double precision, $6::double precision),4326), $7) returning poly_id;', [result2[0].aerogmsid, pointInfo.name.toString(), pointInfo.desc.toString(), '', pointInfo.lng, pointInfo.lat, email.toLocaleString()])
                            .then((result1) =>{
                                if(result1.length>0)
                                {
                                    console.log(result1);
                                    return res.send({status:'success', message:'Information saved successfully!', poly_id:result1[0].poly_id});
                                }
                                else
                                {
                                    return res.send({status:'fail', message:'problem in insertig point records!'});
                                }
                            })
                            .catch(error => {
                                return res.send({status:'error', message:error});
                            });
                        }
                        else{
                            fs.writeFile(photo_path, base64Data, 'base64', function(err) {
                                if(err){
                                    return res.send({status:'fail',message:'Image is not valid!'});
                                }
                                else
                                {
                                    db.any('INSERT INTO public.mobile_poly_points(poly_id, name, descrip, photo, geom, email) VALUES($1::integer, $2, $3, $4,ST_SetSRID(st_makepoint($5::double precision, $6::double precision),4326), $7) returning poly_id;', [result2[0].aerogmsid, pointInfo.name.toString(), pointInfo.desc.toString(), imageloc.toString(), pointInfo.lng, pointInfo.lat, email.toLocaleString()])
                                    .then((result1) =>{
                                        if(result1.length>0)
                                        {
                                            console.log(result1);
                                            return res.send({status:'success', message:'Information saved successfully!', poly_id:result1[0].poly_id});
                                        }
                                        else
                                        {
                                            return res.send({status:'fail', message:'problem in insertig point records!'});
                                        }
                                    })
                                    .catch(error => {
                                        return res.send({status:'error', message:error});
                                    });
                                }
                            });
                        }
                    }
                    else
                    {
                        return res.send({status:'fail', message:'problem in insertig poly records!'});
                    }
                })
                .catch(error => {
                    return res.send({status:'error', message:error});
                });
            }
            else if(polyInfo.geometry != '' && polyInfo.id != ''){
                var imagedate = new Date();
                var timeStamp = imagedate.getTime();
                var imageloc = '/images/m_profile/'+ `${timeStamp}.png`;
                var imageDirloc = path.join(__dirname, '../../aerogms/public/images/m_profile/');
                var base64Data = pointInfo.photo.replace(/^data:image\/png;base64,/, "");
                var photo_path = `${imageDirloc}${timeStamp}.png`;
                if(base64Data == '')
                {
                    db.any('INSERT INTO public.mobile_poly_points(poly_id, name, descrip, photo, geom, email) VALUES($1::integer, $2, $3, $4,ST_SetSRID(st_makepoint($5::double precision, $6::double precision),4326), $7) returning poly_id;', [polyInfo.id, pointInfo.name.toString(), pointInfo.desc.toString(), '', pointInfo.lng, pointInfo.lat, email.toLocaleString()])
                    .then((result1) =>{
                        if(result1.length>0)
                        {
                            console.log(result1);
                            return res.send({status:'success', message:'Information saved successfully!', poly_id:result1[0].poly_id});
                        }
                        else
                        {
                            return res.send({status:'fail', message:'problem in insertig point records!'});
                        }
                    })
                    .catch(error => {
                        return res.send({status:'error', message:error});
                    });
                }   
                else{
                fs.writeFile(photo_path, base64Data, 'base64', function(err) {
                    if(err){
                        return res.send({status:'fail',message:'Image is not valid!'});
                    }
                    else
                    {
                        db.any('INSERT INTO public.mobile_poly_points(poly_id, name, descrip, photo, geom, email) VALUES($1::integer, $2, $3, $4,ST_SetSRID(st_makepoint($5::double precision, $6::double precision),4326), $7) returning poly_id;', [polyInfo.id, pointInfo.name.toString(), pointInfo.desc.toString(), imageloc.toString(), pointInfo.lng, pointInfo.lat, email.toLocaleString()])
                        .then((result1) =>{
                            if(result1.length>0)
                            {
                                console.log(result1);
                                return res.send({status:'success', message:'Information saved successfully!',
                                 poly_id:result1[0].poly_id});
                            }
                            else
                            {
                                return res.send({status:'fail', message:'problem in insertig point records!'});
                            }
                        })
                        .catch(error => {
                            return res.send({status:'error', message:error});
                        });
                    }
                });
                }
            }
            else
            {
                return res.send({message:'Please send valid polygon details!'});
            }
        }
        else{
            console.log('Please send all required details!');
            return res.send({message:'Please send all required details!'});
        }
    }
    else
    {
        return res.send({message:'Please send the required fields!'});
    }
}
module.exports.m_getPoly = function(req, res){
    if(req.body.kuchbhi)
    {
        jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.email)
        {
            db.any('SELECT aerogmsid as poly_id, type, geometry, date, poly_name FROM public.mobile_poly where email=$1 order by date', [jsondata.email.toString()])
            .then(result=>{
                if(result.length>0)
                {
                    let finalresult = [];
                    result.map(element => {
                        finalresult.push({date:element.date, geometry:JSON.parse(element.geometry), poly_id:element.poly_id, type:element.type,poly_name:element.poly_name?element.poly_name:''})
                    })
                    //return res.send({status:'success', data:{date:result[0].date, geometry:JSON.parse(result[0].geometry), poly_id:result[0].poly_id, type:result[0].type}});
                    return res.send({status:'success', data:finalresult});
                }
                else
                {
                    return res.send({status:'success', message:'no records found!'});
                }
            })
            .catch(error=>{
                return res.send({status:'error', message:error});
            })
        }
        else{
            return res.send({status:'fail',message:'Please send the email!'});
        }
    }
    else{
        return res.send({status:'fail',message:'Please send the required fields!'});
    }
}
module.exports.m_getPolyPoints = function(req, res){
    if(req.body.kuchbhi)
    {
        jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.email && jsondata.poly_id)
        {

            db.any('SELECT aerogmsid as poly_id, type, geometry, date FROM public.mobile_poly where email=$1 and aerogmsid=$2::integer order by date', [jsondata.email.toString(), jsondata.poly_id])
            .then(result=>{
                if(result.length>0)
                {
                    let finalresult = [];
                    result.map(element => {
                        finalresult.push({date:element.date, geometry:JSON.parse(element.geometry), poly_id:element.poly_id, type:element.type})
                    })

                    db.any('SELECT aerogmsid as poi_id, poly_id, name, descrip, photo, st_x(geom) lng, st_y(geom) lat, SUBSTRING(date::text, 0, 11) as date FROM public.mobile_poly_points where email=$1 and poly_id=$2::integer;', [jsondata.email.toString(), jsondata.poly_id])
                    .then(result1=>{
                        if(result1.length>0)
                        {
                            return res.send({status:'success', data:result1, poly_geo:finalresult});
                        }
                        else
                        {
                            return res.send({status:'success', message:'no records found!'});
                        }
                    })
                    .catch(error=>{
                        return res.send({status:'error', message:error});
                    })
                }
                else
                {
                    return res.send({status:'success', message:'no records found!'});
                }
            })
            .catch(error=>{
                return res.send({status:'error', message:error});
            })
        }
        else{
            return res.send({status:'fail',message:'Please send the email and poly_id!'});
        }
    }
    else{
        return res.send({status:'fail',message:'Please send the required fields!'});
    }
}

module.exports.m_getPolyPointsById = function(req, res){
    if(req.body.kuchbhi)
    {
        jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.lat && jsondata.lng)
        {
            db.any('SELECT aerogmsid as poi_id, poly_id, name, descrip, photo, st_x(geom) lng, st_y(geom) lat, SUBSTRING(date::text, 0, 11) as date FROM public.mobile_poly_points where st_x(geom)=$1::double precision and st_y(geom)=$2::double precision;', [jsondata.lng, jsondata.lat])
            .then(result1=>{
                if(result1.length>0)
                {
                    return res.send({status:'success', data:result1});
                }
                else
                {
                    return res.send({status:'success', message:'no records found!'});
                }
            })
            .catch(error=>{
                return res.send({status:'error', message:error});
            })
        }
        else
        {
            console.log('please send poi_id!');
            return res.send({message:'Please send poi_id!'});
        }
    }
    else{
        console.log('please send required field!');
        return res.send({message:'Please send required field'});
    }

}

module.exports.m_updatePolyPointsById = function(req, res){
    if(req.body.kuchbhi)
    {
        jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.lat && jsondata.lng && jsondata.data)
        {
            if(jsondata.data.photo === '')
            {
                db.any('UPDATE public.mobile_poly_points SET name=$1, descrip=$2 WHERE st_x(geom)=$3::double precision and st_y(geom)=$4::double precision returning aerogmsid;', [jsondata.data.name.toString(), jsondata.data.descrip.toString(), jsondata.lng, jsondata.lat])
                .then(result1=>{
                    if(result1.length>0)
                    {
                        return res.send({status:'success', message:'Record updated successfully!'});
                    }
                    else
                    {
                        return res.send({status:'success', message:'Try again. Problem in updating record!'});
                    }
                })
                .catch(error=>{
                    return res.send({status:'error', message:error});
                })
            }
            else
            {
                let imagedate = new Date();
                let timeStamp = imagedate.getTime();
                let imageloc = '/images/m_profile/'+ `${timeStamp}.png`;
                let imageDirloc = path.join(__dirname, '../../aerogms/public/images/m_profile/');
                let base64Data = jsondata.data.photo.replace(/^data:image\/png;base64,/, "");
                let photo_path = `${imageDirloc}${timeStamp}.png`;

                fs.writeFile(photo_path, base64Data, 'base64', function(err) {
                    if(err){
                        return res.send({status:'fail',message:'Image is not valid!'});
                    }
                    else
                    {
                        db.any('UPDATE public.mobile_poly_points SET name=$1, descrip=$2, photo=$3 WHERE st_x(geom)=$4::double precision and st_y(geom)=$5::double precision returning aerogmsid;', [jsondata.data.name.toString(), jsondata.data.descrip.toString(), imageloc.toString(), jsondata.lng, jsondata.lat])
                        .then(result1=>{
                            if(result1.length>0)
                            {
                                return res.send({status:'success', message:'Record updated successfully!'});
                            }
                            else
                            {
                                return res.send({status:'success', message:'Try again. Problem in updating record!'});
                            }
                        })
                        .catch(error=>{
                            return res.send({status:'error', message:error});
                        })
                    }
                });
            }
        }
        else
        {
            console.log('please send poi_id and data!');
            return res.send({message:'Please send poi_id and data!'});
        }
    }
    else{
        console.log('please send required field!');
        return res.send({message:'Please send required field'});
    }

}

module.exports.getmsevaToken = function(requ, resp){
try{
    var loginoptions = { method: 'POST',
      url: config.secdata.mseva.authurl,
      headers: config.secdata.mseva.header,
      form: config.secdata.mseva.formdata };
    request(loginoptions, function (error, response, body) {
    if (error) 
        throw new Error(error);
    let ac_tk = JSON.parse(body).access_token; //"ac70f148-5865-459c-afd6-7caa0382c2b1"

    var receiptoptions = { method: 'POST',
      url: config.secdata.mseva.receipturl,
      qs: 
       { fromDate: '1533101918000',
         toDate: '1545284318000',
         businessCode: 'PT',
         tenantId: 'pb.sangatmandi' },
      headers:config.secdata.mseva.headers,
      body: 
       { RequestInfo: 
          { apiId: 'Rainmaker',
            ver: '.01',
            ts: 0,
            action: '_get',
            did: '1',
            key: '',
            msgId: '20170310130900|en_IN',
            authToken: ac_tk }},
      json: true };
    request(receiptoptions, function (error, response, body) {
    if (error) throw new Error(error);
        //console.log(body);
        let payeeDetails = [];
        let newpropsids = '';
        if(body.Receipt && body.Receipt.length>0)
        {
            body.Receipt.map(receipt =>{
                let address = receipt.Bill[0].payeeAddress;
                let property_id_new = receipt.Bill[0].billDetails[0].consumerCode.split(':')[0];
                let amount_paid = receipt.Bill[0].billDetails[0].amountPaid;
                let paid_timestamp = receipt.Bill[0].billDetails[0].receiptDate;
                newpropsids +=  receipt.Bill[0].billDetails[0].consumerCode.split(':')[0] + ',';
                payeeDetails.push({address, property_id_new,amount_paid, paid_timestamp});
            })
        }
        newpropsids = newpropsids.replace(/.$/, '.');

        var optionsprops = { method: 'POST',
          url: config.secdata.mseva.propsurl,
          qs: 
           { tenantId: 'pb.sangatmandi',
             ids: 'PT-319-005731,PT-319-005730,PT-319-005729,PT-319-005728,PT-319-005725,PT-319-005683,PT-319-005679,PT-319-005678,%0APT-319-005609,PT-319-005608,PT-319-005605,PT-319-005603,PT-319-005600,PT-319-005597,PT-319-005389,PT-319-005386,PT-319-003986' },
          headers: config.secdata.mseva.headersp,
          body: '{\n    "RequestInfo": {\n        "apiId": "Rainmaker",\n        "ver": ".01",\n        "ts": "",\n        "action": "_get",\n        "did": "1",\n        "key": "",\n        "msgId": "20170310130900|en_IN",\n        "authToken": "ac70f148-5865-459c-afd6-7caa0382c2b1"\n    }\n}'
        };
        
        request(optionsprops, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
          console.log(payeeDetails);
          resp.status(200).send(payeeDetails);
          

        });
    });
});
}
catch(error){
    resp.status().send({error:error});
}
}

function sendMailForMobile(req, res, from, to, sub, content, message, callback) {
    var smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aerogmsdeveloper@gmail.com',
        pass: 'enbenb123'
      }
    });
    var mailOptions = {
      to: to,//req.body.email,//req.headers.host, //
      from: from,
      subject: sub,
      html: content
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if(err)
        {
            console.log('error in mail sending for mobile' + err);
            callback(err, false);
        }
        console.log('mail send from aerogmsdeveloper@gmail.com to ' + to);
        callback(false, 'success');
    })
    .catch(err=>{
        console.log('error in mail sending for mobile' + err);
        callback(err, false);
    });
  }

module.exports.m_polyRename = function m_polyRename(req, res){
    if(req.body.kuchbhi)
    {
        let jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.poly_id && jsondata.poly_name)
        {
            db.any('update mobile_poly set poly_name=$1 where aerogmsid=$2::integer;', [jsondata.poly_name,jsondata.poly_id])
            .then(result1=>{
               
                    return res.send({status:'success', message:"Polygon renamed successfully."});
            })
            .catch(error=>{
                return res.send({status:'error', message:error});
            })
        }
        else
        {
            console.log('please send poly_id!');
            return res.send({message:'Please send poly_id!'});
        }
    }
    else{
        console.log('please send required field!');
        return res.send({message:'Please send required field'});
    }
  }

module.exports.m_polyDelete = function m_polyDelete(req, res){
    if(req.body.kuchbhi)
    {
        let jsondata = JSON.parse(req.body.kuchbhi);
        if(jsondata.poly_id)
        {
            db.any('delete from mobile_poly where aerogmsid=$1::integer;', [jsondata.poly_id])
            .then(result1=>{
                return res.send({status:'success', message:"Polygon deleted successfully."});
            })
            .catch(error=>{
                return res.send({status:'error', message:error});
            })
        }
        else
        {
            console.log('please send poly_id!');
            return res.send({message:'Please send poly_id!'});
        }
    }
    else{
        console.log('please send required field!');
        return res.send({message:'Please send required field'});
    }
  }
