const { db, pg, pool}=require('../db.js');
const {registervector} = require('../controller/import_controller');


module.exports.get_layers = function(req, res){
    db.func('public.sp_getlayerlist', [req.body.pro_id, req.body.u_id])
    .then(result => {
    if(result)
    {
        return res.status(200).send(result);
    }
    else
    {
        return res.status(200).send({message:'Problem in fetching layer list!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
    });
}

module.exports.rename_layer = function(req, res){
    db.func('public.sp_aerogms', ['rename_layer', [req.body.lay_id, req.body.name]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        console.log(result[0].sp_aerogms);
        return res.status(200).send({lay_id:result[0].sp_aerogms,name:req.body.name});
        //return res.status(200).send({message:'User removed successfully!'});
    }
    else
    {
        return res.status(200).send({message:'Problem in renaming layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
    });
}

module.exports.create_layer = function(req, res){
    var tab_name = req.body.name.toLowerCase();
    db.func('public.fn_add_new_layer', [tab_name, req.body.type])
    .then(result => {
    if(result[0].fn_add_new_layer)
    {
        console.log(result[0].fn_add_new_layer);
        if(result[0].fn_add_new_layer == 'CREATED'){
            db.func('public.fn_insert_layer', ['Point', tab_name, req.body.geom])
            .then(result => {
            if(result[0].fn_insert_layer > 0)
            {
                // updating layers table
                db.func('public.sp_aerogms', ['layer_entry', [tab_name, req.body.type, req.body.pro_id, req.body.user_id]])
                .then(result => {
                if(result[0].sp_aerogms)
                {
                    console.log(result[0].sp_aerogms);
                    registervector(tab_name, function(err){
                        if(err){
                            console.log(err);
                            return res.status(400).send(err);
                        }
                        else{
                            console.log('TABLE PUBLISHED SUCCESSFULLY.');
                            //return res.status(200).json({'status':'published', 'message': 'table created and published successfully.', 'tname':tname});
                            return res.status(200).send({name:tab_name, orig_name:tab_name, type:req.body.type, visible:true, lay_id:result[0].sp_aerogms});
                        }
                    })
                }
                else
                {
                    return res.status(200).send({message:'Problem in layer entry!'});
                }
                })
                .catch(error => {
                console.log('ERROR:', error);
                return res.status(400).send(error);
                });
            }
            else
            {
                return res.status(200).send({message:'Problem in inserting records!'});
            }
            })
            .catch(error => {
            console.log('ERROR:', error);
            return res.status(400).send(error);
            });
            
        }
    }
    else
    {
        return res.status(200).send({message:'Problem in creating new layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
    });
}

module.exports.lay_name_exists = function(req, res){
    db.func('public.sp_aerogms', ['lay_name_exists', [req.body.lay_name]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        return res.status(200).send({pro_id:result[0].sp_aerogms, status:'exists'});
    }
    else
    {
        return res.status(200).send({message:'Problem in checking layer name!', status:'not exists'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send(error);
    });
}