var geourl ='http://localhost:8080/geoserver/ows?';
var m;
var layControl;
var currentLayer=null;

function initMap()
    {
        m = L.map("map", {
            //crs: L.CRS.EPSG4326,
            //projection:'EPSG:4326',
            zoomControl: false,
            measureControl: true
        });
        if (!location.hash) {
            m.setView([28.6057,77.2476], 11);
        }
        m.addHash();
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
            }).addTo(m);
            
           //layControl.addOverlay(water_bodies_MLayer, 'WaterBody');
           //layControl.removeLayer(water_bodies_MLayer);
           
           var osmGeocoder = new L.Control.OSMGeocoder();
           m.addControl(osmGeocoder);

           m.on('overlayadd', function(e){
            debugger
            var activeOverlay = e.layer.options.layers;
        });  
            
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

    }

    try{


        $(document).ready(function() {
                var options = {
                        beforeSubmit: showRequest,
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
                        //alert('Uploading is starting.'); return true;
                        $('#divloader').show();
                    }
					// post-submit callback 
					function showResponse(responseText, statusText, xhr, $form) 
					{ 
                        $('#divloader').hide();
                        if(responseText.message)
                        {
                            alert(responseText.message);
                        }
                        else if(responseText[0].status =='published')
                        {
                            var layer = responseText[0].tname + '_Layer';
                            layer = new L.tileLayer.wms(geourl, {
                                layers: 'AeroGMS:'+ responseText[0].tname, format:'image/png', 'transparent': true, 'tiled': true
                            }).addTo(m);
                            layControl.addOverlay(layer, responseText[0].tname);
                            if(responseText[0].box)
                            {
                                var box = responseText[0].box.replace(/[\'BOX'\(\)]/g, '').split(',');
                                var corner1 = L.latLng(box[0].split(' ')[1], box[0].split(' ')[0]),
                                corner2 = L.latLng(box[1].split(' ')[1], box[1].split(' ')[0]),
                                bounds = L.latLngBounds(corner1, corner2);
                                m.fitBounds(bounds);
                            }
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
                            alert('please check file before upload!');
                        }
                    }
    }
    catch(err)
    {
        alert(err);
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
        alert(type);
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
            currentLayer = null;
            markerPoints = null;
            return { layer_name:name, type:type, latlngs:latlngs};
        }
        else if(type === 'Line' && currentLayer !== null){
            //debugger
            let latlngs =[];
            latlngs = currentLayer.getLayers().map(line => {
                line.editing.disable();
                return line.getLatLngs();
            })
            console.log(latlngs);
            currentLayer.off('click');
            currentLayer = null;
            return { layer_name:name, type:type, latlngs:latlngs};
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
            currentLayer = null;
            return { layer_name:name, type:type, latlngs:latlngs};
        }
    }