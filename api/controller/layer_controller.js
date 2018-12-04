const { db, pg, pool, geocred}=require('../db.js');
const {registervector, getBbox} = require('../controller/import_controller');
const userpw=geocred;
const config = require('../../config');

module.exports.get_layers = function(req, res){
    db.func('public.sp_getlayerlist', [req.body.pro_id, req.body.u_id])
    .then(result => {
    if(result)
    {
        return res.status(200).send(result);
    }
    else
    {
        return res.status(500).send({status:'fail', message:'Problem in fetching layer list!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}
module.exports.rename_layer = function(req, res){
    db.func('public.sp_aerogms', ['rename_layer', [req.body.lay_id.toString(), req.body.name]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        console.log(result[0].sp_aerogms);
        return res.status(200).send({lay_id:result[0].sp_aerogms,name:req.body.name});
        //return res.status(200).send({message:'User removed successfully!'});
    }
    else
    {
        return res.status(500).send({status:'fail', message:'Problem in renaming layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
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
                            return res.status(400).send({status:'error', message:err});
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
                    return res.status(500).send({status:'fail', message:'Problem in layer entry!'});
                }
                })
                .catch(error => {
                console.log('ERROR:', error);
                return res.status(400).send({status:'error', message:error.message});
                });
            }
            else
            {
                return res.status(500).send({status:'fail', message:'Problem in inserting records!'});
            }
            })
            .catch(error => {
            console.log('ERROR:', error);
            return res.status(400).send({status:'error', message:error.message});
            });
        }
    }
    else
    {
        return res.status(500).send({status:'fail', message:'Problem in creating new layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
    }
    else if(tab_type == 'Linestring' || tab_type == 'LineString')
    {
        //tab_type = 'Linestring';
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
                        if(error){
                            console.log(error);
                            return res.status(400).send({status:'error', message:error});
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
                    return res.status(500).send({status:'fail',message:'Problem in layer entry!'});
                }
                })
                .catch(error => {
                console.log('ERROR:', error);
                return res.status(400).send({status:'error', message:error.message});
                });
            }
            else
            {
                return res.status(500).send({status:'fail',message:'Problem in inserting records!'});
            }
            })
            .catch(error => {
            console.log('ERROR:', error);
            return res.status(400).send({status:'error', message:error.message});
            });
            
        }
    }
    else
    {
        return res.status(500).send({status:'fail',message:'Problem in creating new layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
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
                            return res.status(400).send({status:'error', message:err});
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
                    return res.status(500).send({status:'fail', message:'Problem in layer entry!'});
                }
                })
                .catch(error => {
                console.log('ERROR:', error);
                return res.status(400).send({status:'error', message:error.message});
                });
            }
            else
            {
                return res.status(500).send({status:'fail', message:'Problem in inserting records!'});
            }
            })
            .catch(error => {
            console.log('ERROR:', error);
            return res.status(400).send({status:'error', message:error.message});
            });
        }
    }
    else
    {
        return res.status(500).send({status:'fail', message:'Problem in creating new layer!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
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
        return res.status(200).send({message:'checking layer name!', status:'not exists'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
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
                    return res.status(500).send({error:err, message:'layer deleted from database but not from geoserver', status:'partially deleted'});
                }
                else{
                    console.log('LAYER DELETED SUCCESSFULLY.');
                    res.status(200).send({'status':'deleted', 'message': 'layer deleted successfully.', 'layId':layId});
                }
            })
        }
        else
        {
            return res.status(500).send({status:'fail', message:'Problem in deleting layer!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error); // print the error;
        return res.status(400).send({status:'error', message:error.message});
        });
    }
}
module.exports.layer_attribute = function(req, res){
    var tab_name = req.body.layer;
    db.func('public.sp_gettable_attrilist', [tab_name.toString()])
    .then(result => {
    if(result.length>0)
    {
        return res.status(200).send({'status':'success', 'data': result});
    }
    else
    {
        return res.status(200).send({status:'fail', message:'Problem in getting layer attributes or there is no attributes!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}
module.exports.delete_column = function(req, res){
    var tab_name = req.body.layer;
    var col_name = req.body.column;
    db.func('public.sp_aerogms', ['delete_column', [tab_name.toString(), col_name.toString()]])
    .then(result => {
    if(!result[0].sp_aerogms)
    {
        reloadvector(tab_name, function(err){
            if(err){
                return res.status(200).send({status:'fail', message:'Problem in updating attribute in layer!'});
            }
            else{
                return res.status(200).send({'status':'success', 'data': 'deleted'});
            }
        })
    }
    else
    {
        return res.status(200).send({status:'fail', message:'Problem in deleting attribute!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}
module.exports.lay_stats = function(req, res){
    db.func('public.select_dall', [])
        .then(result => {
        if(result[0].select_dall > 0)
        {
            return res.status(200).send({'status':'success', 'data':result[0].select_dall});
        }
        else
        {
            return res.status(200).send({status:'fail', message:result[0]});
        }
        })
        .catch(error => {
        console.log('ERROR:', error);
        return res.status(400).send({status:'error', message:error.message});
        });
}
module.exports.rename_column = function(req, res){
    var tab_name = req.body.layer;
    var old_col_name = req.body.old_column;
    var new_col_name = req.body.new_column;

    db.func('public.sp_aerogms', ['rename_column', [tab_name.toString(), old_col_name.toString(), new_col_name.toString()]])
    .then(result => {
    if(!result[0].sp_aerogms)
    {
        reloadvector(tab_name, function(err){
            if(err){
                return res.status(200).send({status:'fail', message:'Problem in updating attribute in layer!'});
            }
            else{
                return res.status(200).send({'status':'success', 'data': 'renamed'});
            }
        })
    }
    else
    {
        return res.status(200).send({status:'fail', message:'Problem in renaming attribute!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}
module.exports.add_column = function(req, res){
    var tab_name = req.body.layer;
    var col_name = req.body.column;
    var col_type = req.body.type;
    if(col_type == 'number'){
        col_type = 'numeric';
    }
    else if(col_type == 'text'){
        col_type = 'character varying';
    }
    else{
        return res.status(400).send('Column type is wrong!');
    }

    db.func('public.sp_aerogms', ['add_column', [tab_name.toString(), col_name.toString(), col_type.toString()]])
    .then(result => {
    if(!result[0].sp_aerogms)
    {
        reloadvector(tab_name, function(err){
            if(err){
                return res.status(200).send({status:'fail',message:'Problem in adding attribute in layer!'});
            }
            else{
                return res.status(200).send({'status':'success', 'data': 'added'});
            }
        })
    }
    else
    {
        return res.status(200).send({status:'fail', message:'Problem in adding attribute!'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}
module.exports.get_bound = function(req, res){
    let layer_nm = req.body.layer;
    if(layer_nm){
        db.func('public.sp_aerogms', ['get_box', [layer_nm.toString()]])
        .then(result => {
        if(result[0])
        {
            return res.status(200).send({status:'success', box:result[0].sp_aerogms});
            //return res.status(200).json([{'status':'published', 'message': 'table created and published successfully.', 'tname':tname, 'box':result[0].sp_aerogms}]);
        }
        else
        {
            return res.status(200).send({status:'fail', message:'Problem in finding box!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error);
        return res.status(400).send({status:'error', message:error.message});
        //return res.status(400).send({status:'error', message:error.message});
        });
        }
}
var deletevector = function(datasetName, callback){
    //dataset name is the name of the PostGIS table
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   var http = require('http'); //using SSL because of basic auth in this example
   var auth = 'Basic ' + new Buffer(userpw).toString('base64');
   var post_options = {
      host:config.secdata.geo_host,
      port: config.secdata.geo_port,
      path: `${config.secdata.geo_del}/${datasetName}.json?recurse=true`,
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
var reloadvector = function(layer_name, callback){
    if(layer_name){
        deletevector(layer_name, function(err){
            if(err){
                callback('error in deleting layer');
            }
            else{
                registervector(layer_name, function(err){
                    if(err){
                        callback('error in publishing layer');
                    }
                    else{
                        callback(null);
                    }
                })
            }
        })
    }
}
module.exports.exis_layer_insert = function(req, res){
    var tab_name = req.body.name.toLowerCase();
    var tab_type = req.body.type;
    if(tab_type == 'Point')
    {
        db.func('public.fn_insert_layer', ['Point', tab_name, req.body.geom])
        .then(result => {
        if(result[0].fn_insert_layer > 0)
        {
            console.log('inserted Points: ',result[0].fn_insert_layer);
            return res.status(200).send({'status':'success', 'data': 'layer updated successfully.'});
        }
        else
        {
            return res.status(200).send({status:'fail', message:'Problem in inserting records!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error);
        return res.status(400).send({status:'error', message:error.message});
        });
    }
    else if(tab_type == 'Linestring' || tab_type == 'LineString')
    {
        db.func('public.fn_insert_layerline', ['Line', tab_name, req.body.geom])
            .then(result => {
            if(result[0].fn_insert_layerline > 0)
            {
                console.log('inserted Lines: ',result[0].fn_insert_layerline);
                return res.status(200).send({'status':'success', 'data': 'layer updated successfully.'});
            }
            else
            {
                return res.status(200).send({status:'fail', message:'Problem in inserting records!'});
            }
            })
            .catch(error => {
            console.log('ERROR:', error);
            return res.status(400).send({status:'error', message:error.message});
            });
    }
    else if(tab_type == 'Polygon')
    {

        db.func('public.fn_insert_layerline', ['Polygon', tab_name, req.body.geom])
        .then(result => {
        if(result[0].fn_insert_layerline > 0)
        {
            console.log('inserted Polygons: ',result[0].fn_insert_layerline);
            return res.status(200).send({'status':'success', 'data': 'layer updated successfully.'});
        }
        else
        {
            return res.status(200).send({status:'fail',message:'Problem in inserting records!'});
        }
        })
        .catch(error => {
        console.log('ERROR:', error);
        return res.status(400).send({status:'error', message:error.message});
        });  
    }
}
module.exports.update_layer_color = function(req, res){
    var layId = req.body.lay_id;
    var layColor = req.body.color;

    db.func('public.sp_aerogms', ['change_color', [layId.toString(), layColor.toString()]])
    .then(result => {
    if(result[0].sp_aerogms)
    {
        return res.status(200).send({'lay_id':layId, 'color': layColor});
    }
    else
    {
        return res.status(500).send({message:'Problem in changing layer color!', status:'fail'});
    }
    })
    .catch(error => {
    console.log('ERROR:', error); // print the error;
    return res.status(400).send({status:'error', message:error.message});
    });
}