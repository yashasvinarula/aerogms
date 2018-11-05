module.exports.loggedIn = (req, res, next)=>{

    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        //res.redirect('../../aerogms/src/components/loginForm');
     res.status(200).send({message:'login required', 'status':'unauthorised'});
    }
}