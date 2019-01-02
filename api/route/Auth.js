module.exports.loggedIn = (req, res, next)=>{
    // debugger
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        //res.redirect('../../aerogms/src/components/loginForm');
     res.status(401).send({message:'login required', 'status':'unauthorised'});
    }
}