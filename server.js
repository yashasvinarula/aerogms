//"use strict";
const express = require('express');
const  app = express();
const path = require('path');
require('dotenv').config();
const helmet = require('helmet')
const bodyParser = require('body-parser');
const user_route = require('./api/route/user_route')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./passport')(passport);
const config = require('./config/config');
const  morgan = require('morgan');
const winston = require('./config/winston');


// app.set('port', config.secdata.ser_port);
app.set('port', 4001);
app.use(express.static(path.join(__dirname, './aerogms/public')));
//app.use(morgan('combined', { stream: winston.stream }));

// app.use(express.static(path.join(__dirname, './aerogms/build')));
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

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',  parameterLimit: 100000, extended:true}));
app.use(session({
    secret: 'old-rock-ace',
    resave: false, //required
    saveUninitialized: false //required
    }));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use( (req, res, next) => {
    console.log('req.session ', req.session);
    return next();
  });

//   app.use(function(err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = err;//req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });

app.use('/api', user_route);
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, './aerogms/build/index.html'));
});

// app.get('/download', (req, res)=>{
//     res.sendFile(path.join(__dirname, './aerogms/build/sangat_mandi_props.zip'));
// });
  
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});