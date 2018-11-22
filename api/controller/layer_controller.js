const { db, pg, pool, geocred}=require('../db.js');
const {registervector} = require('../controller/import_controller');
const userpw=geocred;

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
    var tab_type = req.body.type;
    if(tab_type == 'Point')
    {
        db.func('public.fn_add_new_layer', [tab_name, tab_type])
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
                db.func('public.sp_aerogms', ['layer_entry', [tab_name, tab_type, req.body.pro_id, req.body.user_id]])
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
                            return res.status(200).send({name:tab_name, orig_name:tab_name, type:tab_type, visible:true, lay_id:result[0].sp_aerogms});
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
    else if(tab_type == 'Line')
    {
        tab_type = 'Linestring';
        db.func('public.fn_add_new_layer', [tab_name, tab_type])
    .then(result => {
    if(result[0].fn_add_new_layer)
    {
        console.log(result[0].fn_add_new_layer);
        if(result[0].fn_add_new_layer == 'CREATED'){
            db.func('public.fn_insert_layerline', ['Line', tab_name, req.body.geom])
            .then(result => {
            if(result[0].fn_insert_layerline > 0)
            {
                // updating layers table
                db.func('public.sp_aerogms', ['layer_entry', [tab_name, tab_type, req.body.pro_id, req.body.user_id]])
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
                            return res.status(200).send({name:tab_name, orig_name:tab_name, type:tab_type, visible:true, lay_id:result[0].sp_aerogms});
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
    else if(tab_type == 'Polygon')
    {
        db.func('public.fn_add_new_layer', [tab_name, tab_type])
    .then(result => {
    if(result[0].fn_add_new_layer)
    {
        console.log(result[0].fn_add_new_layer);
        if(result[0].fn_add_new_layer == 'CREATED'){
            db.func('public.fn_insert_layerline', ['Polygon', tab_name, req.body.geom])
            .then(result => {
            if(result[0].fn_insert_layerline > 0)
            {
                // updating layers table
                db.func('public.sp_aerogms', ['layer_entry', [tab_name, tab_type, req.body.pro_id, req.body.user_id]])
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
                            return res.status(200).send({name:tab_name, orig_name:tab_name, type:tab_type, visible:true, lay_id:result[0].sp_aerogms});
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

module.exports.delete_layer = function(req, res){
    var layName = req.body.layer_name;
    var layId = req.body.lay_id
    if(layName && layId)
    {
        db.func('public.sp_aerogms', ['delete_layer', [layName, layId.toString()]])
        .then(result => {
        if(result[0].sp_aerogms == layId)
        {
            //return res.status(200).send({pro_id:result[0].sp_aerogms, status:'exists'});
            deletevector(layName, function(err){
                if(err){
                    console.log(err);
                    return res.status(400).send({'Error':err, message:'layer deleted from database but not from geoserver', status:'partially deleted'});
                }
                else{
                    console.log('LAYER DELETED SUCCESSFULLY.');
                    res.status(200).send({'status':'deleted', 'message': 'layer deleted successfully.', 'layId':layId});
                }
            })
        }
        else
        {
            return res.status(200).send({message:'Problem in deleting layer!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send(error);
        });
    }
}

var deletevector = function(datasetName, callback){
    //dataset name is the name of the PostGIS table
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   var http = require('http'); //using SSL because of basic auth in this example
   var auth = 'Basic ' + new Buffer(userpw).toString('base64');
   var post_options = {
      host:'localhost',
      port: '8080',
      path: `http://localhost:8080/geoserver/rest/layers/${datasetName}.json?recurse=true`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
	    'Authorization': auth
      }
   }
   // Set up the request
   var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      if (res.statusCode === 200){
          res.on('data', function (chunk) {
          });
	    callback(null);
      }
      else if(res.statusCode === 404){
        res.on('data', function (chunk) {});
        callback('layer is not found!');
      }
      else{
          res.on('data', function (chunk) {
              //something went wrong so call back with error message
             callback(chunk);
          });
      }
   });
   //post_req.write(s);
   post_req.end();
};