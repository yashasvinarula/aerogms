const {pgp, db, pg, pool, geocred}=require('../db.js');
const userpw=geocred;
const ogr2ogr = require('ogr2ogr');
const fs = require('fs');
const JSONStream = require('JSONStream');


module.exports.fileuploaddprocess = function(req, res){
    var readErrflag = false;
    try
    {
     if(req.myfilename)
     {
         let filepath = 'files/'+ req.myfilename;
         let tabname = req.myfilename.split('.')[0].replace(' ', '_').replace(/[\])}[{(]/g, '');
         //var query = 'SELECT * FROM  pg_catalog.pg_tables WHERE tablename='+tabname;
         db.any('SELECT * FROM  pg_catalog.pg_tables WHERE tablename=$1', [tabname])
         .then((result) => 
         {
             if(result.length == 0)
             { 
                 if(req.myfilename.split('.')[1].toLowerCase() == 'geojson' || req.myfilename.split('.')[1].toLowerCase() == 'json')
                 {
                     readjson(filepath, req, res);
                 }
                 else
                 {
                 let newfilepath = 'files/'+ req.myfilename.split('.')[0] + '.json';
                 var geojson = ogr2ogr(filepath)
                 .options(["--config", "SHAPE_RESTORE_SHX", "TRUE"])
                 .stream().on('error', (err)=>{
                  readErrflag=true;
                  this.destroy;
                  if(err.message=="No valid files found")
                  {
                     fs.unlinkSync(filepath);//unlinkSync
                     return res.send([{status:'zipFileError', message:'Zipped file is not in correct format! May be not containing proper shapefile.'}]);
                  }
                      //return res.send(err);
                  })
                  var writable =fs.createWriteStream(newfilepath).on(
                          "finish",
                          function handleEnd() {
                             let size = (writable.bytesWritten)/(1024*1024);
                             if(size>92)
                             {
                                 fs.unlink(filepath,function(err){
                                     if(err) {
                                         console.log(err);
                                         return res.send([{status:'oversize', message:'file size is too large! Please upload zip file upto 30MB and geojson upto 90MB.'}]);
                                     }
                                     console.log('file deleted successfully');
                                         fs.unlink(newfilepath,function(err){
                                             if(err){
                                                 console.log(err);
                                                 return res.send([{status:'oversize', message:'file size is too large! Please upload zip file upto 30MB and geojson upto 90MB.'}]);
                                             }
                                             console.log('file deleted successfully');
                                             return res.send([{status:'oversize', message:'file size is too large! Please upload zip file upto 30MB and geojson upto 90MB.'}]);
                                         })
                                });     
                             }
                             else{
                                 console.log("JSONStream parsing complete!");
                                 fs.unlink(filepath,function(err){
                                     if(err) console.log(err);
                                     console.log('file deleted successfully');
                                     if(readErrflag){
                                         fs.unlink(newfilepath,function(err){
                                             if(err){
                                                 console.log(err);
                                                 return res.send([{status:'ogr failed', message:'file size is too large!'}]);
                                             } 
                                             console.log('file deleted successfully');
                                             return res.send([{status:'ogr failed', message:'file size is too large!'}]);
                                         })
                                     }  
                                });  
                                if(!readErrflag)
                                {
                                 readjson(newfilepath, req, res);
                                }
                             }
                              }).on('error', (err)=>{
                                  return res.send(err);
                             });
                  geojson.pipe(writable);
                 }
             }
             else
             {
                 fs.unlinkSync(filepath);
                 return res.status(200).json([{'status':'EXISTS', 'message': 'Layer is already exists!', 'tname':tabname}]);
             }
         })
         .catch(error => {
             console.log(error.message);
             return res.status(400).send(error.message);
         });      
        }
        else
        {
         return res.send([{status:'nofile', message:'Please select a file before upload!'}]);
        }
     }
    catch(err){
        console.log(err);
        return res.end(err.message);
    }
}

function readjson(newfilepath, req, res){
    try
    {
        //let newfilepath = JSON.parse(req.body.file).path
        fileStream = fs.createReadStream(newfilepath, {encoding: 'utf8'});
        fileStream.pipe(JSONStream.parse())
        .on("data",
            function handleRecord(data) {
                let filesize = (fileStream.bytesRead)/(1024*1024);
            if(filesize>95)
            {
                fs.unlink(newfilepath,function(err){
                    if(err) console.log(err);
                    console.log('file deleted successfully');
                    return res.send([{status:'oversize', message:'file size is too large! Please upload zip file upto 30MB and geojson upto 90MB.'}]);
                })
            }
            else{
                console.log('get data from json file');
                fs.unlinkSync(newfilepath);//unlinkSync
                layerfromjson(data, req, res)
            }   
            }
        )
    }
    catch(err)
    {
        res.end(err.message);
    }
}

function layerfromjson( jsonObj, req, res)
{
    var shpArr = []; var filedArr =[];          
    let tname = '';
    let fieLdnamestr='';
    let geomType = ''; let tabgeomType='';
    var valArr=[], geomValArr=[];
try
{
    shpArr = jsonObj;
    tname = req.myfilename.split('.')[0].replace('-', '_').replace(' ', '_').replace(/[\])}[{(]/g, '');//shpArr.name.toLowerCase();
    geomType =shpArr.features[0].geometry.type;
    let geometerytype = shpArr.features[0].geometry.type.toLowerCase();

    if(geometerytype == 'point')
    {
        if(Math.abs(shpArr.features[0].geometry.coordinates[0])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0])<=180){
            if(Math.abs(shpArr.features[0].geometry.coordinates[1])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[1])<=90){;}
            else
            return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
        }
        else
        return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
    }
    else if(geometerytype == 'linestring' || geometerytype == 'multipoint')
    {
        if(Math.abs(shpArr.features[0].geometry.coordinates[0][0])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][0])<=180){
            if(Math.abs(shpArr.features[0].geometry.coordinates[0][1])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][1])<=90){;}
            else
            return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
        }
        else
        return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
    }
    else if(geometerytype == 'polygon' || geometerytype == 'multilinestring')
    {
        if(Math.abs(shpArr.features[0].geometry.coordinates[0][0][0])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][0][0])<=180){
            if(Math.abs(shpArr.features[0].geometry.coordinates[0][0][1])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][0][1])<=90){;}
            else
            return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
        }
        else
        return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
    }
    else if(geometerytype == 'multipolygon')
    {
        if(Math.abs(shpArr.features[0].geometry.coordinates[0][0][0][0])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][0][0][0])<=180){
            if(Math.abs(shpArr.features[0].geometry.coordinates[0][0][0][1])>=0 && Math.abs(shpArr.features[0].geometry.coordinates[0][0][0][1])<=90){;}
            else
            return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
        }
        else
        return res.send([{status:'nolatlongPro', message:'Please select a file which have latlong or epsg:4326 projection!'}]);
    }


    tabgeomType = geomType;
    if(geomType=='MultiPolygon' && shpArr.features[0].geometry.coordinates[0][0][0].length ==3)
    {
        tabgeomType='MultiPolygonZ';
    }
    // else if(geomType == 'Polygon')
    // {
    //     tabgeomType='MultiPolygon';
    //     geomType ='MultiPolygon';
    // }
    filedArr = Object.keys(shpArr.features[0].properties);
    if(filedArr.length == 0)
    {
        return res.send([{status:'noPropertyfield', message:'Please select a file which have features and properties (ex .shp and .dbf or json with properties)!'}]);
    }

    fieldArrLower =[];
    let idx = filedArr.indexOf("__color__");
    if (idx > -1) { filedArr.splice(idx, 1);}
    for (let i = 0; i < filedArr.length; i++) {
        fieldArrLower[i] = filedArr[i].toLowerCase().replace('-', '_').replace(' ', '_');
    }

    function insrtrecords()
    {
        for(let i=0; i < fieldArrLower.length; i++){
            fieLdnamestr += fieldArrLower[i] + '@';
        }
        fieLdnamestr+='{\"name\": \"geom\", \"mod\": \":raw\"}'; // \"init\": getGeom
        //fieLdnamestr = fieLdnamestr.slice(0, -1);
       
        const getGeom = col => {const p = col.value;
            if(tabgeomType == 'MultiPolygonZ')
            {
                return p ? pgp.as.format('ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":\${type}, "coordinates":${coordinates}}\'), 4326)', p).replace('array', '').replace("'"+p.type+"'", '"'+p.type.replace(/\'/g, "") +'"') : 'NULL';
            }
            else{
                return p ? pgp.as.format('ST_force2d(ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":\${type}, "coordinates":${coordinates}}\'), 4326))', p).replace('array', '').replace("'"+p.type+"'", '"'+p.type.replace(/\'/g, "") +'"') : 'NULL';
            }
        };
        
        var arrField =fieLdnamestr.split('@');
        arrField[arrField.length-1] = JSON.parse(arrField[arrField.length-1]);
        arrField[arrField.length-1].init = getGeom;
        var cs = new pgp.helpers.ColumnSet(arrField, {table: tname});
    
        var data = [];
        //{id: '2.35', ward_no: '1000', ward_name:'aaa', area_sqkm:'123',population:'12345'}
        
        for(let i=0; i < shpArr.features.length; i++){
            let collval = '';
            let collArrVal ={};
            for(let j=0; j<filedArr.length;j++)
            {
                //collval += "'"+ shpArr.features[i].properties[filedArr[j]] + "' , ";
                collArrVal[filedArr[j].toLowerCase().replace('-', '_').replace(' ', '_')] = shpArr.features[i].properties[filedArr[j]] ;
            }
            //valArr.push(collval);
            collArrVal['geom'] ={ type:geomType , coordinates:shpArr.features[i].geometry.coordinates};
            data.push(collArrVal);
            //collval.slice(0, -3);
            //valArr.push({columns:collval, geometry: '{type:'+geomType+ ', coordinates:'+ shpArr.features[i].geometry.coordinates+'}'});
            //valArr.push({columns:collval, geometry:geomType + '(( '+ shpArr.features[i].geometry.coordinates+' ))'});
            // geomValArr.push({ type:geomType , coordinates:shpArr.features[i].geometry.coordinates});
        }

        const insert = pgp.helpers.insert(data, cs);
        db.none(insert)
        .then(() => {
            console.log('TABLE CREATED AND DATA INSERTED SUCCESSFULLY.');
            //res.status(200).json({'status': 'table created successfully', 'tname':tname});
            registervector(tname, function(err){
                if(err){
                    console.log(err);
                    return res.status(200).send(err);
                }
                else{
                    //your table will appear as a new layer in GeoServer admin UI
                    db.func('public.sp_aerogms', ['get_box', [tname.toString()]])
                    .then(result => {
                    if(result[0])
                    {
                        //return res.status(200).send({pro_id:result[0].sp_aerogms});
                        console.log('TABLE PUBLISHED SUCCESSFULLY.');
                        return res.status(200).json([{'status':'published', 'message': 'table created and published successfully.', 'tname':tname, 'box':result[0].sp_aerogms}]);
                    }
                    else
                    {
                        return res.status(200).send({message:'Problem in finding box!'});
                    }
                    })
                    .catch(error => {
                    console.log('ERROR:', error); // print the error;
                    return res.status(400).send(error);
                    });
                }
            })
        })
        .catch(error => {
            console.log(error.message);
            res.status(400).send(error.message);
        });
    }
    pool.connect().then(client=> {
        client.query('SELECT public.sp_add_new_table($1, $2, $3)',[tname, fieldArrLower, tabgeomType]).then(result => {
            if(result.rows[0].sp_add_new_table == 'CREATED')
            {
                console.log('table created with type: '+ tabgeomType);
                client.release();
                insrtrecords();
            }
            else{
                console.log('table exist: '+ tname);
                client.release()
                return res.status(200).send(result.rows);
            }
        }).catch(err => {
            console.log(err.message);
            client.release();
            return res.status(400).send(err.message);
          });
            }).catch(e => {
            console.log(e.message);
        client.release();
        return res.status(400).send(e.message);
      });

}
catch(err)
{
    console.log(err.message);
    shpArr = []; filedArr =[]; valArr=[], geomValArr=[];    
    tname = '';fieLdnamestr='';geomType = ''; tabgeomType='';
    return res.status(200).send([{status:'formatError', message:'file is not in proper format! Please check and try again.'}]);
}
}

 var registervector = function(datasetName, callback){
    //dataset name is the name of the PostGIS table
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //my dev SSL is self-signed. don't do this in production.
   var http = require('http'); //using SSL because of basic auth in this example
   var auth = 'Basic ' + new Buffer(userpw).toString('base64');
   //build the object to post
   var post_data = {'featureType': {'name': datasetName}};
   //be sure to turn it into a string
   var s = JSON.stringify(post_data);
   var post_options = {
      host:'localhost',
      port: '8080',
      path: 'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes',
      method: 'POST',
      headers: {
        'Content-Length': s.length,
        'Content-Type': 'application/json',
	    'Authorization': auth
      }
   }
   // Set up the request
   var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      //201 is good, anything else is Problem
      if (res.statusCode === 201){
          res.on('data', function (chunk) {
          });
        //since we're good, call back with no error
	    callback(null);
      }
      else{
          res.on('data', function (chunk) {
              //something went wrong so call back with error message
             callback(chunk);
          });
      }
   });
   // post the data
   post_req.write(s);
   post_req.end();
};

module.exports.registervector = registervector;

module.exports.deletelayer = function(request, responce){
    //dataset name is the name of the PostGIS table
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //my dev SSL is self-signed. don't do this in production.
   var http = require('http'); //using SSL because of basic auth in this example
   var auth = 'Basic ' + new Buffer(userpw).toString('base64');
   //build the object to post
   var post_data = {'featureType': {'name': request.body.layername}};
   //be sure to turn it into a string
   var s = JSON.stringify(post_data);
   var post_options = {
      host:'localhost',
      port: '8080',
      path: 'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes',
      method: 'DELETE',
      headers: {
        'Content-Length': s.length,
        'Content-Type': 'application/json',
	    'Authorization': auth
      }
   }
   // Set up the request
   var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      //201 is good, anything else is Problem
      if (res.statusCode === 201){
          res.on('data', function (chunk) {
          });
        responce.status(201).send({message:'layer deleted!'})
	    //callback(null);
      }
      else{
          res.on('data', function (chunk) {
              //something went wrong so call back with error message
              responce.status(400).send({message:'layer not deleted! '+ chunk})
             //callback(chunk);
          });
      }
   });
   // post the data
   post_req.write(s);
   post_req.end();
};

module.exports.insertShpTable = function(req, res){
    var shpArr = []; var filedArr =[];          
    let tname = '';
    let fieLdnamestr='';
    let geomType = ''; let tabgeomType='';
    var valArr=[], geomValArr=[];
try
{
    shpArr = JSON.parse(req.body.layer);
    tname = shpArr.fileName.toLowerCase();
    geomType =shpArr.features[0].geometry.type;
    tabgeomType = geomType;
    if(geomType=='MultiPolygon' && shpArr.features[0].geometry.coordinates[0][0][0].length ==3)
    {
        tabgeomType='MultiPolygonZ';
    }

    filedArr = Object.keys(shpArr.features[0].properties);
    fieldArrLower =[];
    let idx = filedArr.indexOf("__color__");
    if (idx > -1) { filedArr.splice(idx, 1);}
    for (let i = 0; i < filedArr.length; i++) {
        fieldArrLower[i] = filedArr[i].toLowerCase().replace('-', '_');
    }

    function insrtrecords()
    {
        for(let i=0; i < fieldArrLower.length; i++){
            fieLdnamestr += fieldArrLower[i] + '@';
        }
        fieLdnamestr+='{\"name\": \"geom\", \"mod\": \":raw\"}'; // \"init\": getGeom
        //fieLdnamestr = fieLdnamestr.slice(0, -1);
       
        const getGeom = col => {const p = col.value;
            if(tabgeomType == 'MultiPolygonZ')
            {
                return p ? pgp.as.format('ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":\${type}, "coordinates":${coordinates}}\'), 4326)', p).replace('array', '').replace("'"+p.type+"'", '"'+p.type.replace(/\'/g, "") +'"') : 'NULL';
            }
            else{
                return p ? pgp.as.format('ST_force2d(ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":\${type}, "coordinates":${coordinates}}\'), 4326))', p).replace('array', '').replace("'"+p.type+"'", '"'+p.type.replace(/\'/g, "") +'"') : 'NULL';
            }
        };
        
        var arrField =fieLdnamestr.split('@');
        arrField[arrField.length-1] = JSON.parse(arrField[arrField.length-1]);
        arrField[arrField.length-1].init = getGeom;
        var cs = new pgp.helpers.ColumnSet(arrField, {table: tname});
    
        var data = [];
        //{id: '2.35', ward_no: '1000', ward_name:'aaa', area_sqkm:'123',population:'12345'}
        
        for(let i=0; i < shpArr.features.length; i++){
            let collval = '';
            let collArrVal ={};
            for(let j=0; j<filedArr.length;j++)
            {
                //collval += "'"+ shpArr.features[i].properties[filedArr[j]] + "' , ";
                collArrVal[filedArr[j].toLowerCase().replace('-', '_')] = shpArr.features[i].properties[filedArr[j]] ;
            }
            //valArr.push(collval);
            collArrVal['geom'] ={ type:geomType , coordinates:shpArr.features[i].geometry.coordinates};
            data.push(collArrVal);
            //collval.slice(0, -3);
            //valArr.push({columns:collval, geometry: '{type:'+geomType+ ', coordinates:'+ shpArr.features[i].geometry.coordinates+'}'});
            //valArr.push({columns:collval, geometry:geomType + '(( '+ shpArr.features[i].geometry.coordinates+' ))'});
            // geomValArr.push({ type:geomType , coordinates:shpArr.features[i].geometry.coordinates});
        }

        const insert = pgp.helpers.insert(data, cs);

        db.none(insert)
        .then(() => {
            console.log('TABLE CREATED AND DATA INSERTED SUCCESSFULLY.');
            //res.status(200).json({'status': 'table created successfully', 'tname':tname});
            registervector(tname, function(err){
                if(err){
                    console.log(err);
                    return res.status(400).send(err);
                }
                else{
                    //your table will appear as a new layer in GeoServer admin UI
                    console.log('TABLE PUBLISHED SUCCESSFULLY.');
                    return res.status(200).json({'status':'published', 'message': 'table created and published successfully.', 'tname':tname});
                }
            })
        })
        .catch(error => {
            console.log(error.message);
            res.status(400).send(error.message);
        });
    }

    // db.task(t => {
    //     // execute a chain of queries against the task context, and return the result:
    //     return t.one('SELECT public.sp_add_new_table($1, $2, $3)',[tname, fieldArrLower, geomType])
    //         .then(result => {
    //             if(result.rows[0].sp_add_new_table == 'CREATED')
    //             {
    //                 //client.release();
    //                 return insrtrecords();
    //             }
    //             else{
    //                 //client.release()
    //                 res.status(200).send(result.rows);
    //             }
    //             //return {count};
    //         });    
    //     }).then(data => {
    //         // success, data = either {count} or {count, logs}
    //     })
    //     .catch(error => {
    //         // failed    
    //     });


   pool.connect().then(client=> {
        client.query('SELECT public.sp_add_new_table($1, $2, $3)',[tname, fieldArrLower, tabgeomType]).then(result => {
            if(result.rows[0].sp_add_new_table == 'CREATED')
            {
                console.log('table created with type: '+ tabgeomType);
                client.release();
                insrtrecords();
            }
            else{
                console.log('table exist: '+ tname);
                client.release()
                return res.status(200).send(result.rows);
            }
        }).catch(err => {
            console.log(err.message);
            client.release();
            return res.status(400).send(err.message);
          });
            }).catch(e => {
            console.log(e.message);
        client.release();
        return res.status(400).send(e.message);
      });

}
catch(err)
{
    console.log(err.message);
    shpArr = []; filedArr =[]; valArr=[], geomValArr=[];    
    tname = '';fieLdnamestr='';geomType = ''; tabgeomType='';
    res.status(400).send(err.message);
}

    // pool.connect(function(err,client,done) {
    //     if(err){
    //         console.log("not able to get connection "+ err);
    //         res.status(400).send(err);
    //     } 
    //     client.query('SELECT public.sp_add_new_table($1, $2, $3)',[tname, filedArr, geomType],function(err,result) {
    //         done(); // closing the connection;
    //         if(err){
    //             console.log(err);
    //             return res.status(400).send(err.message);
    //             //return;
    //         }
    //         else if(result.rows[0].sp_add_new_table == 'EXISTS')
    //         {

    //         }
    //         //res.status(200).send(result.rows);
    //     });
    //  });
    //res.send({'status':'ok'});
}


