//"use strict";
const express = require('express');
const  app = express();
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const user_route = require('./api/route/user_route')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./passport')(passport);



app.set('port', process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, './aerogms/public')));


//Adding CORS support
app.all('*', function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        next();
    }
});

app.use( (req, res, next) => {
    console.log('req.session', req.session);
    return next();
  });

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',  parameterLimit: 100000, extended:true}));
app.use(cookieParser());
app.use(session({
    secret: 'old-rock-ace', //pick a random string to make the hash that is generated secure
    resave: false, //required
    saveUninitialized: false //required
    }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', user_route)

app.get('/logout', (req, res) => {
    req.logout();
    console.log('message: logout');
    res.status(200).send({message:'loggedOut'});
  });

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});