const { db, pg, pool}=require('../db.js');

module.exports.layer_entry = function(req, res){
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