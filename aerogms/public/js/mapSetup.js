var geourl ='http://localhost:8080/geoserver/ows?';
var m;
var layControl;
var currentLayer=null;
var pid = null;

var jalandhar_prop_layer;
var jalandhar_wfs_layer;
var selcted_fea_info = {};
var getLayerDataFromJS;

function addJalandharLayer(){
var owsrootUrl = 'http://localhost:8080/geoserver/ows';
var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'AeroGMS:jalandhar',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4326'
};

var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);

var ajax = $.ajax({
    url : URL,
    dataType : 'jsonp',
    jsonpCallback : 'getJson',
    success : function (response) {
        debugger
        jalandhar_wfs_layer = L.geoJson(response, {
            style: function (feature) {
                return {
                    stroke: true,
                    fillColor: '0000FF',
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function (feature, layer) {
                debugger
                popupOptions = {maxWidth: 200};
                //"Popup text, access attributes with feature.properties.ATTRIBUTE_NAME"
                layer.bindPopup('covered_area : '+feature.properties.covered_area + '<br/>' + 'unit_price : ' + feature.properties.unit_price ,popupOptions);
                document.getElementById('infoText').innerHTML = '';

                //showInfoDiv();
                //document.getElementById('infoText').innerHTML = 'covered_area : '+feature.properties.covered_area + '<br/>' + 'unit_price : ' + feature.properties.unit_price;
            }
        }).addTo(m);
    }
});
}

function initMap()
    {
        if(m){ m.remove();}
       
        //document.getElementById('map').nodeValue= null;
        document.getElementById('map').style.display = 'block';
        m = L.map("map", {
            //crs: L.CRS.EPSG4326,
            //projection:'EPSG:4326',
            zoomControl: false,
            measureControl: false
        });
        if (!location.hash) {
            //m.setView([28.6057,77.2476], 11); // delhi view
            m.setView([31.3635, 75.5962], 15); // jalandhar view
        }
        //m.addHash();
        var url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        
        var optionsObject ={
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }
    
        var mq = L.tileLayer(url, optionsObject);
        var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        });
        var osmMap = new L.TileLayer(osmUrl);
        var dummyMap = L.tileLayer('', '');
        osmMap.addTo(m);
        
         var water_bodies_MLayer = new L.tileLayer.wms(geourl, {
            layers: 'AeroGMS:water_bodies', format:'image/png', 'transparent': true, 'tiled': true
        });//.addTo(m);
        
        // var roadMutant = L.gridLayer.googleMutant({
        // 		maxZoom: 24,
        // 		type:'roadmap'
        // 	})//.addTo(m);
    
        // var satMutant = L.gridLayer.googleMutant({
        // 		maxZoom: 24,
        // 		type:'satellite'
        // 	});
        
        L.control.scale().addTo(m);
         var baseLayers = {
            "OSM":osmMap,
            "Stamen Watercolor": watercolor,
            "Stamen Toner": mq,
            "No Maps":dummyMap
            };
            var overlays = {};//{"WaterBody":water_bodies_MLayer};
        
            layControl = L.control.orderlayers(baseLayers, overlays,{
                collapsed: true,
                title: 'Layers'
            })//.addTo(m);
            
           //layControl.addOverlay(water_bodies_MLayer, 'WaterBody');
           //layControl.removeLayer(water_bodies_MLayer);
           
        //    var osmGeocoder = new L.Control.OSMGeocoder();
        //    m.addControl(osmGeocoder);

           m.on('overlayadd', function(e){
            var activeOverlay = e.layer.options.layers;
        });  

        // jalandhar_prop_layer = new L.tileLayer.wms(geourl, {
        //     layers: 'AeroGMS:jalandhar', format:'image/png', 'transparent': true, 'tiled': true
        // }).addTo(m);
        //addJalandharLayer();
        // m.on('click', function(ev) {
        //     alert(ev.latlng); // ev is an event object (MouseEvent in this case)
        // });
        //-----------------------------------------------------------
        
        $('#btnGoToLoc').on('click', function()
        {m.locate({setView : true})});   
        //make the map
        //-----------------------------------------------------------
        var pIcon = L.icon({
            iconUrl: './images/pointer.png',
            iconSize:     [12, 12], // size of the icon
        });
        var myPolyStyle = {color: '#0000ff', weight:12 ,radius:4, clickTolerance:15};
        
        var multipolygon = L.featureGroup({color:'#0000ff'}).addTo(m);
        
        //for area
        var polygon = L.polygon({color: 'red'}).addTo(m);
        polygon.setStyle({color: '#ff0000', weight:7,radius:4});
        //for distance
        var distLine = L.polyline({color:'#ff0000', clickTolerance:15}).addTo(m);
        distLine.setStyle({color:'#ff0000', weight:12});	
        //-----------------------------------------------------------
        var options = {
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        if(k === '__color__'){
                            return;
                        }
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            },
            style: function(feature) {
                return {
                    opacity: 1,
                    fillOpacity: 0.7,
                    radius: 6,
                    color: feature.properties.__color__
                }
            },
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    opacity: 1,
                    fillOpacity: 0.7,
                    color: feature.properties.__color__
                });
            }
        };

         //--------------info-----------------
        
         m.on('click', function(e) {
            // Build the URL for a GetFeatureInfo
            var jalandharLayer = wmsLayers.filter(layer=>{
                if(layer.options){
                    if(layer.options.layers.split(':')[1] == 'jalandhar'){
                        return layer;
                    }
                }
            })
            var url = getFeatureInfoUrl(
                            m,
                            jalandharLayer[0],
                            e.latlng,
                            {
                                'info_format': 'application/json',
                                'propertyName': 'sid,name,address,zone,nature,covered_area,vacant_area'
                                //'FEATURE_COUNT': 50
                            }
                        );
            //Send the request and create a popup showing the response
            reqwest({
                url: url,
                type: 'json',
            }).then(function (data) {
                if(data.features.length > 0){
                    debugger
                    selcted_fea_info={};
                    var feature = data.features[0];
                    selcted_fea_info = feature.properties;
                    // selcted_fea_info['sid'] = feature.properties.sid;
                    // selcted_fea_info['covered_area'] = feature.properties.covered_area;
                    // selcted_fea_info['unit_price'] = feature.properties.unit_price;
                    // L.popup()
                    // .setLatLng(e.latlng)
                    // .setContent(L.Util.template("<h2>{covered_area}</h2><p>{unit_price}</p>", feature.properties))
                    // .openOn(m);

                    let pro_tax = null;
                    if(feature.properties.zone == 1){
                        pro_tax = parseInt(feature.properties.covered_area)*5 + parseInt(feature.properties.vacant_area)*2.5;
                    }
                    if(feature.properties.zone == 2){
                        pro_tax = parseInt(feature.properties.covered_area)*3 + parseInt(feature.properties.vacant_area)*2;
                    }
                    document.getElementById('infoText').innerHTML = '';
                    document.getElementById('infoDiv').style.display = 'block';
                    document.getElementById('infoText').innerHTML =  'AeroGMS_id : '+ feature.properties.sid + '<br/>' 
                    + 'Name : '+feature.properties.name + '<br/>' 
                    + 'Address : ' + feature.properties.address + '<br/>' 
                    + 'Zone : '+feature.properties.zone + '<br/>' 
                    + 'Nature : ' + feature.properties.nature + '<br/>' 
                    + 'Covered Area : '+feature.properties.covered_area + '<br/>' 
                    + 'Vacant Area : ' + feature.properties.vacant_area + '<br/>' 
                    + 'Property Tax : ' + pro_tax;
                }
              
            }).catch(err=>{
                //alert(err);
            });
        });
        

         function getFeatureInfoUrl(map, layer, latlng, params) {

            var point = map.latLngToContainerPoint(latlng, map.getZoom()),
                size = map.getSize(),
                bounds = map.getBounds(),
                sw = bounds.getSouthWest(),
                ne = bounds.getNorthEast();
                //sw = crs.projection._proj.forward([sw.lng, sw.lat]),
                //ne = crs.projection._proj.forward([ne.lng, ne.lat]);
        
            var defaultParams = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: 'EPSG:4326',//layer._crs.code,
                styles: '',
                version: layer._wmsVersion,
                format: layer.options.format,
                //bbox: m.getBounds(),//[sw.join(','), ne.join(',')].join(','),
                bbox:[sw.lng, sw.lat, ne.lng, ne.lat],
                height: size.y,
                width: size.x,
                layers: layer.options.layers,
                query_layers: layer.options.layers,
                info_format: 'text/html'
            };
        
            params = L.Util.extend(defaultParams, params || {});
        
            params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
            params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
        
            return layer._url + L.Util.getParamString(params, layer._url, true);
        
        }
          //--------------------------------------------

        let url_string = window.location.href;
        let prourl = new URL(url_string);

        //--------------import ---------
        try{
            $(document).ready(function() {
                //$('#divCompTable').draggable();
    
                    var options = {
                            beforeSubmit: showRequest,
                            data:{ 'pro_id':pid},
                            success: showResponse
                            };
                            // bind to the form's submit event 
                            $('#frmUploader').submit(function () { $(this).ajaxSubmit(options); 
                            // always return false to prevent standard browser submit and page navigation return false;
                            return false;
                            }); 
                        });
                            
                        // pre-submit callback 
                        function showRequest(formData, jqForm, options)
                        {
                            debugger
                            //alert('Uploading is starting.'); return true;
                            
                            $('#divloader').show();
                        }
                        // post-submit callback 
                        function showResponse(responseText, statusText, xhr, $form) 
                        { 
                            debugger
                            document.getElementById('divImportLayer').style.display='none';
                            $('#divloader').hide();
                            if(responseText.message)
                            {
                                alert(responseText.message);
                            }
                            else if(responseText.status)
                            {
                                var box = responseText.status.box;
                                if(box)
                                {
                                    var box = box.replace(/[\'BOX'\(\)]/g, '').split(',');
                                    var corner1 = L.latLng(box[0].split(' ')[1], box[0].split(' ')[0]),
                                    corner2 = L.latLng(box[1].split(' ')[1], box[1].split(' ')[0]),
                                    bounds = L.latLngBounds(corner1, corner2);
                                    m.fitBounds(bounds);
                                }
                                getLayerDataFromJS(responseText.status);
                                // var layer = responseText[0].tname + '_Layer';
                                // layer = new L.tileLayer.wms(geourl, {
                                //     layers: 'AeroGMS:'+ responseText[0].tname, format:'image/png', 'transparent': true, 'tiled': true
                                // }).addTo(m);
                                // layControl.addOverlay(layer, responseText[0].tname);
                                // if(responseText[0].box)
                                // {
                                //     var box = responseText[0].box.replace(/[\'BOX'\(\)]/g, '').split(',');
                                //     var corner1 = L.latLng(box[0].split(' ')[1], box[0].split(' ')[0]),
                                //     corner2 = L.latLng(box[1].split(' ')[1], box[1].split(' ')[0]),
                                //     bounds = L.latLngBounds(corner1, corner2);
                                //     m.fitBounds(bounds);
                                // }
                                //alert('Layer is saved and published successfully.');
                            }
                            else if(responseText[0].sp_add_new_table == 'EXISTS')
                            {
                                alert('Layer is already exists!');
                            }
                            else if(responseText[0].status)
                            {
                                alert(responseText[0].message);
                            }
                            else if(responseText)
                            {
                                alert(responseText);
                            }
                            else
                            {
                                document.getElementById('divImportLayer').style.display='none';
                                alert('please check file before upload!');
                            }
                        }
        }
        catch(err)
        {
            document.getElementById('divImportLayer').style.display='none';
            alert(err);
        }
        //--------------
        pid = prourl.searchParams.get("pro_id");
        return pid;
        //m.addEventListener('click', Identify);
    }

    function getBound(){
        // $.ajax({
        //     type:'GET',
        //     url:'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes/canal.json',
        //     //data:{},
        //     dataType: 'jsonp',
        //     jsonpCallback: 'callback',
        //     //headers: {'Authorization': "Basic " + btoa('admin' + ":" + 'geoserver')},
        //     // beforeSend: function (xhr) {
        //     //     xhr.setRequestHeader ("Authorization", "Basic " + btoa('admin:geoserver'));
        //     // },
        //     //headers:{'Authorization': "Basic " + btoa('admin:geoserver')},
        //     success: function(data){
        //         debugger
        //         alert('success');
        //         var result =JSON.parse(data);
        //     },
        //     error: function(err){
        //         alert(err);
        //     }
        // })

        // $.ajax({
        //     type: 'GET',
        //     dataType: 'jsonp',
        //     url: 'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes/canal.json',
        //     data: {},
        //     username: 'admin',
        //     password: 'geoserver',
        //     success: function(data)
        //     { 
        //         debugger
        //         var d =data;
        //         alert('fetched successfully. Status: '+textStatus); 
        //     },
        //     error: function(jqXHR, textStatus, errorThrown)
        //     { 
        //         debugger
        //         alert('error: ' + textStatus); 
        //     }
        //     });


        //     $.ajax({
        //         type:'POST',
        //         url:"http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes/canal.json",
        //         dataType: 'jsonp'// Notice! JSONP <-- P (lowercase)
          
        //    }).then(function(data) {
        //        debugger
        //     console.log('success callback 2', data) 
        //   })
        //   .catch(function(xhr) {
        //       debugger
        //     console.log('error callback 1', xhr);
        //   })


        // $.ajax({
        //     type:'GET',
        //     url: 'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes/canal.json',
        //     dataType: 'json',
        //     //jsonpcallback: 'callback',
        //     crossDomain: true, // tell browser to allow cross domain.
        //     beforeSend: function (xhr) {
        //             xhr.setRequestHeader("Authorization", "Basic " + btoa('admin:geoserver'));
        //      },
        //      success: function(data){
        //          alert(data);
        //      },
        //      error: function(err){

        //      }
        // });
        // function callback(json) {
        //     alert(json);
        // }

            $.ajax({
              type: 'GET',
              url:'http://localhost:8080/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes/canal.json',
              dataType: 'jsonp',
              jsonpCallback: 'myCallBackMethod',
              async: false, // this is by default false, so not need to mention
              crossDomain: true, // tell the browser to allow cross domain calls.
              error: function(err){
                  alert(err);
              }
              // success: successResopnse, jsonpCallback will call the successCallback
              //error: failureFunction jsonp does not support errorCallback. So cannot use this 
            });
          
        
          window.myCallBackMethod = function(data) {
           successResponse(data);
          }
          
          successResponse = function(data) {
          //functionality goes here;
          alert('Success')
          }
    }

    var type;
    function createNewLayer(layer_type){
        type = layer_type;
        if(currentLayer === null){
            switch(type){
                case 'Point':
                    currentLayer = new L.featureGroup([]).addTo(m);
                    break;
                case 'Line':
                    currentLayer = new L.featureGroup([]).addTo(m);
                    break;
                case 'Polygon':
                    currentLayer = new L.featureGroup([]).addTo(m);
                    break;
                default:
                    break;
            }
            layControl.addOverlay(currentLayer, type);
            currentLayer.on('click', function(e){
                e.target.getLayers().map(layer => {layer.editing.disable()});
                e.sourceTarget.editing.enable();
                selFeature =  e.sourceTarget._leaflet_id;
                if(currentLayer)
                $('#removeFeature').css('visibility', 'visible');
            })
        }
    }

    var selFeature = null;
    function removeSelFeature(){
        if(selFeature !== null  && currentLayer !== null ){
            currentLayer.removeLayer(currentLayer._layers[selFeature]);
        }
        $('#removeFeature').css('visibility', 'hidden');
    }

    
    function addPoint(){
        debugger
        if(type === 'Point' && currentLayer !== null){
            L.DomUtil.addClass(m._container,'crosshair-cursor-enabled');
            if(currentLayer.getLayers().length === 0){
                m.on("click", function(e)
                {
                    let pointMarker = new L.Marker([e.latlng.lat, e.latlng.lng]);
                    //pointArrayLL.push([e.latlng.lat, e.latlng.lng]);
                    currentLayer.addLayer(pointMarker);
                    //L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
                 })
            }
        }
    }

    function addLine(){
        debugger
        if(type === 'Line' && currentLayer !== null){
            L.DomUtil.addClass(m._container,'crosshair-cursor-enabled');
            var polyLineLayer = new L.Polyline([], {color: 'red',  weight: 4, dashArray: '10,5',}).addTo(m);
            m.on("click", function(e)
            {
                polyLineLayer.addLatLng(e.latlng);
                //currentLayer.addLayer(pointMarker);
             })

             m.on("dblclick", function(e){
                m.removeLayer(currentLayer);
                m.off("click");
                m.off("dblclick");
                L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
                currentLayer.addLayer(polyLineLayer);
                m.removeLayer(polyLineLayer);
                polyLineLayer=null;
                currentLayer.addTo(m);
             })
        }
    }

    function addPolygon(){
        debugger
        if(type === 'Polygon' && currentLayer !== null){
            L.DomUtil.addClass(m._container,'crosshair-cursor-enabled');
            var polygonLayer = new L.Polygon([], {color: 'red', weight: 4}).addTo(m);

            m.on("click", function(e)
            {
                polygonLayer.addLatLng(e.latlng);
                //currentLayer.addLayer(pointMarker);
             })
             m.on("dblclick", function(e){
                m.removeLayer(currentLayer);
                m.off("click");
                m.off("dblclick");
                L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
                currentLayer.addLayer(polygonLayer);
                m.removeLayer(polygonLayer);
                polygonLayer=null;
                currentLayer.addTo(m);
             })
        }
    }

    function saveLayer(type, name){
        //alert(type);
        $('#removeFeature').css('visibility', 'hidden');
        if(type === 'Point' && currentLayer !== null){
            L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
            let markerPoints = currentLayer.getLayers();
            let latlngs =[];
            markerPoints.map(marker => {
                latlngs.push([marker._latlng.lat, marker._latlng.lng]);
            })
            //alert(latlngs);
            console.log(latlngs);
            m.off("click");
            currentLayer.off('click');  
            m.removeLayer(currentLayer);
            currentLayer = null;
            markerPoints = null;

            if(pid != null && pid != undefined)
            return { layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
        }
        else if(type === 'Line' && currentLayer !== null){
            debugger
            let latlngs =[];
            latlngs = currentLayer.getLayers().map(line => {
                line.editing.disable();
                return line.getLatLngs();
            })
            console.log('original lines latlng Array:');
            console.log(latlngs);
            currentLayer.off('click');
            m.removeLayer(currentLayer);
            currentLayer = null;
            debugger
            return { layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
        }
        else if(type === 'Polygon' && currentLayer !== null){
            let latlngs =[];
            latlngs = currentLayer.getLayers().map(polygon => {
                polygon.editing.disable();
                return polygon.getLatLngs();
                //latlngs.push(polygon.getLatLngs());
            })
            console.log(latlngs);
            currentLayer.off('click');
            m.removeLayer(currentLayer);
            currentLayer = null;
            return { layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
        }
    }


    var wmsLayers =[];
    function addWMSLayer(layName){
        debugger
        let isLayerExist = null;
        if(layName != undefined && layName!= null){
            isLayerExist = wmsLayers.filter(layer=>{
                if(layer.options){
                    if(layer.options.layers.split(':')[1] == layName){
                        return layer;
                    }
                }
            })
            if(isLayerExist.length == 0){
                var layer = layName;
                layer = new L.tileLayer.wms(geourl, {
                layers: 'AeroGMS:'+ layName, format:'image/png', transparent:true, tiled:true
                }).addTo(m);
                wmsLayers.push(layer);
            }
        }
    }

    function hideWMSLayer(layName){
        debugger
        console.log(wmsLayers);
        wmsLayers =  wmsLayers.filter(layer=>{
            if(layer.options.layers.split(':')[1] == layName)
            {
                m.removeLayer(layer);
                return false;
            }
            else{
                return layer;
            }
        })
        console.log(wmsLayers);
    }

    function closeInfoDiv(){
        document.getElementById('infoDiv').style.display = 'none';
    }

    function getSelectedFeaValue(){
        if(Object.keys(selcted_fea_info).length != 0){
            return selcted_fea_info;
        }
        else{
            alert('please select feature!');
        }
    }
