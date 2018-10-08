const { db, pg, pool}=require('../db.js');
const bcrypt = require('bcryptjs');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.user_signup =  function(req, res){

    let valArr =[];
    valArr.push(req.body.firstName);
    valArr.push(req.body.lastName);
    valArr.push(req.body.email);
    valArr.push(req.body.mobile);
    let pw = bcrypt.hashSync(req.body.password, 10)
    valArr.push(pw);

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
            return res.status(200).send({message:result2[0].sp_aerogms});
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
    console.log(req.user);
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

module.exports.pw_reset = function(req, res){
    const email = req.body.email;
    const pw = req.body.password;
    if(email && pw)
    {
        const hashpw = bcrypt.hashSync(pw, 10);

        db.func('public.sp_aerogms', ['pw_change', [email, hashpw]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            console.log(result[0].sp_aerogms);
            return res.status(200).send({message:result[0].sp_aerogms});
        }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            return res.status(400).send(error);
        });
    }
    else{
        console.log('email and pw are undefined!');
    }
}

module.exports.pw_forgot = function(req, res) {

        var token = crypto.randomBytes(20).toString('hex');
        var mailId = '123@123';//req.body.email;
        db.func('public.sp_aerogms', ['user_existance', [mailId]])
        .then(result => {
        if(result[0].sp_aerogms)
        {
            console.log('forgot user exist ' + result[0].sp_aerogms);
            let time =Date.now() + 3600000;
            db.func('public.sp_aerogms', ['token_update', [mailId, token, '00011122000']])
            .then(result => {
            if(result[0].sp_aerogms)
            {
                console.log(result[0].sp_aerogms);
                sendMail(req, res);
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
            return res.status(401).send({message:'Email id not exists!'});
        }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            return res.status(400).send(error);
        });

      function sendMail(req, res) {
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'elevenx099@gmail.com',
            pass: 'enbenb@123'
          }
        });
        var mailOptions = {
          to: 'prateekjain7676@gmail.com',//req.headers.host, //
          from: 'elevenx099@gmail.com',
          subject: 'AeroGMS Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + 'localhost:3001' + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err, info) {
            if(err)
            {
                console.log('error in mail sending ' + err);
            }
            console.log(info);
          res.status(200).send({message:'An e-mail has been sent to ' + 'prateekjain7676@gmail.com' + ' with further instructions.'});
          //done(err, 'done');
        });
      }
  }
