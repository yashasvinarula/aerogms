const { db, pg, pool}=require('../db.js');
const bcrypt = require('bcryptjs');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

                let from = process.env.mail_id;
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
                let from = process.env.mail_id;
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
        //console.log(info);
      return res.status(200).send({message:message});
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
    return res.status(400).send(error);
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
        return res.status(200).send({message:'User already removed!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
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
            let from = process.env.mail_id;
            let to = retVal[1];
            let sub = 'AeroGMS account Activation Status';
            let content ='Welcome to AeroGMS Family.\n\n' + 
            'Your account has been activated. Now you can login.\n\n';
            let message = req.body.u_id;//'Your account has been activated successfully.';
            sendMail(req, res, from, to, sub, content, message);
        }
        else{
            let from = process.env.mail_id;
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
        return res.status(200).send({message:'Problem in status toggling'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
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
            //return res.status(200).send({message:'User removed successfully!'});
        }
        else
        {
            return res.status(200).send({message:'Problem in creating new project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
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
            return res.status(200).send({message:'Problem in fetching project list!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
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
            return res.status(200).send({message:'Problem in deleting project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
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
            return res.status(200).send({message:'Problem in renaming project!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
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
