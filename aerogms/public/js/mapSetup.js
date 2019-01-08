var geourl ='http://localhost:8081/geoserver/ows?';
//var geourl ='http://122.176.113.56:8081/geoserver/ows?';
var m;
var layControl;
var currentLayer=null;
var pid = null;
var jalandhar_prop_layer;
var jalandhar_wfs_layer;
var selcted_fea_info = {};
var getLayerDataFromJS;
var setAttrInfo;
var activeMapLayer;
var activeMapLayer_id = '';
var hideInfoBox, showInfoBox;
var nf_hl_Layer =  new L.featureGroup([]);
var sangatLayer=undefined;
var sikarLayer = undefined;

function enablemap(){
    debugger
    m.on('click', function(e){
        getInfo(e);
    });
}
function zoomTo(box){
    debugger
    if(box)
    {
        debugger
        var box = box.replace(/[\'BOX'\(\)]/g, '').split(',');
        var corner1 = L.latLng(parseFloat(box[0].split(' ')[1]) + 0.001, box[0].split(' ')[0]),
        corner2 = L.latLng(box[1].split(' ')[1] , box[1].split(' ')[0]),
        bounds = L.latLngBounds(corner1, corner2);
        // console.log(corner1);
        // console.log(corner2);
        // console.log(bounds);
        m.fitBounds(bounds);
    }
}
function addJalandharLayer(){
    debugger
var owsrootUrl = geourl;
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
        console.log(response);
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
function capFL(string) {
    debugger
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getFeatureInfoUrl(map, layer, latlng, params) {
    debugger
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
function initMap(){
    debugger
        if(m){ m.remove();}
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
        var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
        var url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var satLayer = L.tileLayer("https://1.aerial.maps.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?app_id=nNKwromcftRseWU464ZI&app_code=tIWKR3_1_sFG7Efmp_8Luw");
        
        var optionsObject ={
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>', maxZoom: 25
        }
    
        var mq = L.tileLayer(url, optionsObject);
        var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>', maxZoom: 25
        });
        var osmMap = new L.TileLayer(osmUrl,{ maxZoom: 25});
        var dummyMap = L.tileLayer('', '');
        osmMap.addTo(m);
        
        
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
            "Satellite":satLayer,
            "Stamen Watercolor": watercolor,
            "Stamen Toner": mq,
            //"Google Map":satMutant,
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
            var activeOverlay = e.layer.options.layers;
        });

        $('#btnGoToLoc').on('click', function()
        {m.locate({setView : true})});   
        var pIcon = L.icon({
            iconUrl: './images/pointer.png',
            iconSize:     [12, 12], // size of the icon
        });
        var myPolyStyle = {color: '#0000ff', weight:12 ,radius:4, clickTolerance:15};
        var multipolygon = L.featureGroup({color:'#0000ff'}).addTo(m);
        
        var polygon = L.polygon({color: 'red'}).addTo(m);
        polygon.setStyle({color: '#ff0000', weight:7,radius:4});
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
            }};

            m.on('click', function(e){
            getInfo(e);
         });
        let url_string = window.location.href;
        let prourl = new URL(url_string);

        //--------------import --------------
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
        //-----------------
        pid = prourl.searchParams.get("pro_id");
        return pid;
        //m.addEventListener('click', Identify);
    }

    var type;
    function createNewLayer(layer_type){
        debugger
        type = layer_type;
        m.off("click");
        m.off("dblclick");
        L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
        debugger
        if(currentLayer?currentLayer.getLayers().length>0:false){
            m.removeLayer(currentLayer)
        }
        //currentLayer.addLayer(polyLineLayer);
        currentLayer = null;
        markerPoints = null;
        polyLineLayer=null;
        polygonLayer=null;
        enablemap();
        
        if(currentLayer === null){
            switch(type){
                case 'Point':
                    currentLayer = new L.featureGroup([]).addTo(m);
                    break;
                case 'Linestring':
                    currentLayer = new L.featureGroup([]).addTo(m);
                    break;
                case 'LineString':
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
                $('#removeFeature').css('display', 'inline-block');
            })
        }
    }

    function resetNewLayer(){
        debugger
        sangatLayer ? false: m.off("click");
        m.off("dblclick");
        if(currentLayer?currentLayer.getLayers().length>0:false){
            m.removeLayer(currentLayer)
        }
        currentLayer = null;
        markerPoints = null;
        polyLineLayer=null;
        polygonLayer=null;
        L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
        enablemap();
    }

    function getInfo(e) {
        debugger
       nf_hl_Layer ? resetnfhl():'';        
       if(activeMapLayer && activeMapLayer_id && currentLayer?currentLayer.getLayers().length == 0:true){
           var selectedWMSLayer = wmsLayers.filter(layer=>{
               if(layer.options){
                   if(layer.options.layers.split(':')[1] == activeMapLayer){
                       return layer;
                   }
               }
           })
           //debugger
           if(selectedWMSLayer.length==0)
           {
                return;
           }
           var url = getFeatureInfoUrl(
                           m,
                           selectedWMSLayer[0],
                           e.latlng,
                           {
                            'info_format': 'application/json'
                            //'propertyName': 'sid,name,address,zone,nature,covered_area,vacant_area'
                            //'FEATURE_COUNT': 50
                        }
                       );
           //Send the request and create a popup showing the response
           reqwest({
               url: url,
               type: 'json',
           }).then(function (data) {
               if(data.features.length > 0){
                   var feature = data.features[0];
                   // L.popup()
                   // .setLatLng(e.latlng)
                   // .setContent(L.Util.template("<h2>{covered_area}</h2><p>{unit_price}</p>", feature.properties))
                   // .openOn(m);
                   featureHL(activeMapLayer, feature.geometry.type.toLowerCase(), feature.properties.aero_id);
                   let finalInfoArray='';
                   if(activeMapLayer == 'jalandhar')
                   {
                       let pro_tax = null;
                       if(feature.properties.zone == 1){
                           pro_tax = parseInt(feature.properties.covered_area)*5 + parseInt(feature.properties.vacant_area)*2.5;
                       }
                       if(feature.properties.zone == 2){
                           pro_tax = parseInt(feature.properties.covered_area)*3 + parseInt(feature.properties.vacant_area)*2;
                       }
                       let keysArray = Object.keys(feature.properties);
                       keysArray.sort();
                       finalInfoArray = keysArray.map(key => {
                           return {name:capFL(key), value:(key == 'creation_date')?`${feature.properties[key].split('T')[0]} ${feature.properties[key].split('T')[1].substring(0, 5)}` :feature.properties[key]}
                       })

                       finalInfoArray = finalInfoArray.map(obj =>{
                        if(obj.name === 'Property_tax')
                        {
                            obj.value = pro_tax;
                        }
                        return obj;
                       })
                       //finalInfoArray['Property_tax'] = pro_tax;
                       //finalInfoArray.push({name:'Property Tax', value:pro_tax});
                       setAttrInfo(finalInfoArray);
                   }
                   else
                   {
                       // runs all the time when data is fetched
                       debugger
                       let keysArray = Object.keys(feature.properties);
                       keysArray.sort();
                       finalInfoArray = keysArray.map(key => {
                           return {name:capFL(key), value:(key == 'creation_date')?`${feature.properties[key].split('T')[0]} ${feature.properties[key].split('T')[1].substring(0, 5)}` :feature.properties[key]}
                       })
                       setAttrInfo(finalInfoArray);
                   }
                   showInfoBox();
                   //document.getElementById('infoDiv').style.display = 'block';

               }
               else
               {
                lyrhighlighter ? m.removeLayer(lyrhighlighter):false;
                hideInfoBox();
               }
             
           }).catch(err=>{
               //alert(err);
           });
       }
   }

   function resetnfhl(){
    debugger
    nf_hl_Layer ? m.removeLayer(nf_hl_Layer):'';
    nf_hl_Layer = new L.featureGroup([]);
   }

    var selFeature = null;
    function removeSelFeature(){
        debugger
        if(selFeature !== null  && currentLayer !== null ){
            currentLayer.removeLayer(currentLayer._layers[selFeature]);
        }
        $('#removeFeature').css('display', 'none');
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
                 })
            }
        }
    }

    function addLine(){
        debugger
        if((type === 'Linestring' || type === 'LineString') && currentLayer !== null){
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
                enablemap();
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
                enablemap();
             })
        }
    }

    function saveLayer(type, name){
        //alert(type);
        debugger
        $('#removeFeature').css('display', 'none');
        if(Object.keys(currentLayer._layers).length>0)
        {
            if(type === 'Point' && currentLayer !== null){
                L.DomUtil.removeClass(m._container,'crosshair-cursor-enabled');
                let markerPoints = currentLayer.getLayers();
                let latlngs =[];
                markerPoints.map(marker => {
                    latlngs.push([marker._latlng.lat, marker._latlng.lng]);
                })
                //alert(latlngs);
                console.log(latlngs);
                resetnfhl();
                m.off("click");
                currentLayer.off('click');
                currentLayer.addTo(nf_hl_Layer);
                m.removeLayer(currentLayer);
                currentLayer = null;
                m.addLayer(nf_hl_Layer);  
                markerPoints = null;
                enablemap();
                if(pid != null && pid != undefined)
                return { layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
            }
            else if((type === 'Linestring' || type === 'LineString') && currentLayer !== null){
                debugger
                let latlngs =[];
                let invalidflag =false;
                latlngs = currentLayer.getLayers().map(line => {
                    line.editing.disable();
                    debugger
                    let comArray =[];
                    comArray = line.getLatLngs().filter((ele, index, self) =>
                        index === self.findIndex((t) => (
                        t.lat === ele.lat && t.lng === ele.lng
                    )))
                    if(comArray.length >= 2)
                    {
                        return comArray;
                    }
                    else{
                        invalidflag = true;
                        line.editing.enable();
                    }
                    //return line.getLatLngs();

                })
                if(!invalidflag)
                {
                    console.log('original lines latlng Array:');
                    console.log(latlngs);
                    resetnfhl();
                    currentLayer.off('click');
                    currentLayer.setStyle({color:'#00ffff'});
                    currentLayer.addTo(nf_hl_Layer);
                    m.removeLayer(currentLayer);
                    currentLayer = null;
                    m.addLayer(nf_hl_Layer);
                    return { status:'success', layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
                }
                else{
                    console.log(latlngs);
                    return {status:'fail', layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
                }
            }
            else if(type === 'Polygon' && currentLayer !== null){
                let latlngs =[];
                let invalidflag =false;
                latlngs = currentLayer.getLayers().map(polygon => {
                    polygon.editing.disable();
                    let comArray =[];
                    comArray = polygon.getLatLngs().map((array1)=>{
                        return array1.filter((ele, index, self) =>
                                        index === self.findIndex((t) => (
                                        t.lat === ele.lat && t.lng === ele.lng
                                    )))
                    })
                    if(comArray[0].length >= 3)
                    {
                        return comArray;
                    }
                    else{
                        invalidflag = true;
                        polygon.editing.enable();
                    }
                })
                if(!invalidflag)
                {
                    debugger
                    console.log(latlngs);
                    resetnfhl();
                    currentLayer.off('click');
                    currentLayer.setStyle({color:'#00ffff'});
                    //nf_hl_Layer.addLayer(Object.assign({}, currentLayer.getLayers()));
                    currentLayer.addTo(nf_hl_Layer);
                    m.removeLayer(currentLayer);
                    currentLayer = null;
                    //nf_hl_Layer.addTo(m);
                    m.addLayer(nf_hl_Layer);
                    return {status:'success', layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
                }
                else{
                    console.log(latlngs);
                    return {status:'fail', layer_name:name, type:type, latlngs:latlngs, pro_id:pid};
                }
             
            }
        }
        else{
            alert('First add some feature then save the layer!');
        }
    }

    // adds overlay to the map
    var wmsLayers =[];
    function addWMSLayer(layName, color){
        debugger
        color = color ? color:'0000ff';
        if(activeMapLayer_id && document.getElementById(activeMapLayer_id))
        {
            lyrhighlighter ? m.removeLayer(lyrhighlighter):false;
            document.getElementById(activeMapLayer_id).click();
        }
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
                layers: 'AeroGMS:'+ layName, format:'image/png', transparent:true, tiled:true, env:"color:"+color,  maxZoom: 25
                }).addTo(m);
                wmsLayers.push(layer);//env:'color:00FF00'
            }
            else if(isLayerExist.length == 1){
                isLayerExist[0].setParams({env:"color:"+color}, false);
            }
        }
    }
    var lyrhighlighter = ''; // 
    function featureHL(layName, laytype, aeroid){
        debugger
            if(laytype && layName && aeroid){
                lyrhighlighter ? m.removeLayer(lyrhighlighter):false;
                if(laytype === 'polygon' || laytype === 'multipolygon' || laytype === 'linestring')
                {
                    lyrhighlighter = new L.tileLayer.wms(geourl, {
                    layers: 'AeroGMS:'+ layName, format:'image/png', transparent:true, tiled:true, CQL_FILTER:"aero_id="+ aeroid , env:'color:00FFFF', maxZoom: 25
                    }).addTo(m);
                    //wmsLayers.push(layer);//env:'color:00FF00'
                }
                else if(laytype === 'point')
                {
                    lyrhighlighter = new L.tileLayer.wms(geourl, {
                        layers: 'AeroGMS:'+ layName, format:'image/png', transparent:true, tiled:true, CQL_FILTER:"aero_id="+ aeroid , env:'color:00FFFF;size:8' , maxZoom: 25
                        }).addTo(m);
                }
            }
    }

    function updateWMSLayer(layName){
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
            if(isLayerExist.length == 1){
                debugger
                isLayerExist[0].setParams({date:Date.now()}, false);
            }
        }
    }
  
    function updateWMSStyle(layName, laystyle, attribute, attrValue){
        debugger
        let isLayerExist = null;
        if(layName != undefined && layName!= null){
            isLayerExist = wmsLayers.filter(layer=>{
                if(layer.options){
                    debugger
                    if(layer.options.layers.split(':')[1] == layName){
                        return layer;
                    }
                    else{
                        if(layer.wmsParams.styles.split('_')[1])
                        {
                            layer.wmsParams.styles = layer.wmsParams.styles.split('_')[0];
                        }
                    }
                }
            })
            if(isLayerExist.length == 1){
                if(attribute && attrValue) {
                    isLayerExist[0].setParams({styles:laystyle, cql_filter : attribute + `=` + `'` + attrValue + `'`}, false);
                    // isLayerExist[0].setParams({styles:laystyle, cql_filter : "categories='Governmental'"}, false);
                } else {
                    isLayerExist[0].setParams({styles:laystyle,}, false);
                }
            }
        }
    }
    // function updateWMSStyle(layName, laystyle){
    //     debugger
    //     let isLayerExist = null;
    //     if(layName != undefined && layName!= null){
    //         isLayerExist = wmsLayers.filter(layer=>{
    //             if(layer.options){
    //                 debugger
    //                 if(layer.options.layers.split(':')[1] == layName){
    //                     return layer;
    //                 }
    //                 else{
    //                     if(layer.wmsParams.styles.split('_')[1])
    //                     {
    //                         layer.wmsParams.styles = layer.wmsParams.styles.split('_')[0];
    //                     }
    //                 }
    //             }
    //         })
    //         if(isLayerExist.length == 1){
    //             isLayerExist[0].setParams({styles:laystyle}, false);
    //         }
    //     }
    // }
    // cql_filter : "categories = 'Agricultural'"
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

    function getSelectedFeaValue(){
        debugger
        if(Object.keys(selcted_fea_info).length != 0){
            return selcted_fea_info;
        }
        else{
            alert('please select feature!');
        }
    }

    function addSnagatMandiLayer(ward, from, to)
    {
        debugger
        sangatLayer?m.removeLayer(sangatLayer):'';
        sangatLayer?layControl.removeLayer(sangatLayer):'';
        if(!ward || !from || !to) {
            sangatLayer = new L.tileLayer.wms(geourl, {
                layers: 'AeroGMS:sangat_mandi_props',
                format:'image/png', 
                transparent:true, 
                tiled:false,
                maxZoom: 25
            });//.addTo(m);
        } else {
            sangatLayer = new L.tileLayer.wms(geourl, {
                layers: 'AeroGMS:sangat_mandi_props',
                format:'image/png', 
                transparent:true, 
                tiled:false,
                cql_filter: `area_sqyard > '${from}' And area_sqyard < '${to}' And ward_no='${ward}'`,
                maxZoom: 25
            });//.addTo(m);
        }
        
        layControl.addOverlay(sangatLayer, 'Sangat Layer');
        var corner2 = L.latLng(30.091423962135 + 0.001, 74.8419154894146),
        corner1 = L.latLng(30.082162604414002 , 74.8347664375407),
        bounds = L.latLngBounds(corner1, corner2);
        m.fitBounds(bounds);
        
        // if(sangatLayer)
        // {
            m.on('click', function(e){
          
            var url = getFeatureInfoUrl(
                m,
                sangatLayer,
                e.latlng,
                {
                    'info_format': 'application/json'
                    //'propertyName': 'aero_id,property_id_old,property_id_new,tax_status,financial_year,amount_paid,address,area_sqyard'
                    //'FEATURE_COUNT': 50
                }
            );
            //Send the request and create a popup showing the response
            reqwest({
            url: url,
            type: 'json',
            }).then(function (data) {
            if(data.features.length > 0){
                var feature = data.features[0];//feature.geometry.type.toLowerCase()
                featureHL('sangat_mandi_props', 'polygon', feature.properties.aero_id);
               
                let keysArray = Object.keys(feature.properties);
                keysArray.sort();
                let finalInfoArray=[];
                debugger
                keysArray.map(key => {
                    if(key == 'aero_id' || key == 'property_id_old' || key == 'property_id_new' || key == 'tax_status'|| key=='financial_year' || key=='amount_paid'|| key=='address'|| key=='area_sqyard')
                    {
                        finalInfoArray.push({name:capFL(key), value:(key == 'creation_date')?`${feature.properties[key].split('T')[0]} ${feature.properties[key].split('T')[1].substring(0, 5)}` :feature.properties[key]});
                    }
                })
                setAttrInfo(finalInfoArray);
                showInfoBox();
            }
            else
            {
             lyrhighlighter ? m.removeLayer(lyrhighlighter):false;
             hideInfoBox();
            }
    
            }).catch(err=>{
            });   
        });
        //}
    }
    function addSikarLayer(categ, from, to) {
        debugger
        sikarLayer?m.removeLayer(sikarLayer):'';
        sikarLayer?layControl.removeLayer(sikarLayer):'';
        if(categ == null || from == null || to == null) {
            sikarLayer = new L.tileLayer.wms(geourl, {
                layers: 'AeroGMS:landuse',
                format:'image/png', 
                transparent:true, 
                tiled:false,
                maxZoom: 25,
                // cql_filter:"shape_area>1000 And shape_area<100000"
                // cql_filter: "categories = 'Agricultural'"
            });//.addTo(m);
        } else {
            sikarLayer = new L.tileLayer.wms(geourl, {
                layers: 'AeroGMS:landuse',
                format:'image/png', 
                transparent:true, 
                tiled:false,
                maxZoom: 25,
                // cql_filter:"shape_area>1000 And shape_area<100000"
                // cql_filter: "categories = 'Agricultural'"
                cql_filter: `shape_area > '${from}' And shape_area < '${to}' And categories='${categ}'`
            });//.addTo(m);
        }
        console.log(`Filters : ${sikarLayer}`)
        layControl.addOverlay(sikarLayer, 'Sikar Layer');

        var corner2 = L.latLng(27.7144682006816 + 0.001, 75.2621877689494),
        corner1 = L.latLng(27.5214266021175, 75.0448867985928),
        bounds = L.latLngBounds(corner1, corner2);
        m.fitBounds(bounds);
        
        // if(sangatLayer)
        // {
            m.on('click', function(e){
          
            var url = getFeatureInfoUrl(
                m,
                sikarLayer,
                e.latlng,
                {
                    'info_format': 'application/json'
                    //'propertyName': 'aero_id,property_id_old,property_id_new,tax_status,financial_year,amount_paid,address,area_sqyard'
                    //'FEATURE_COUNT': 50
                }
            );
            //Send the request and create a popup showing the response
            reqwest({
            url: url,
            type: 'json',
            }).then(function (data) {
            if(data.features.length > 0){
                var feature = data.features[0];//feature.geometry.type.toLowerCase()
                featureHL('landuse', 'polygon', feature.properties.aero_id);
               
                let keysArray = Object.keys(feature.properties);
                keysArray.sort();
                let finalInfoArray=[];
                debugger
                keysArray.map(key => {
                    if(key == 'objectid' || key == 'name' || key == 'shape_leng' || key == 'shape_area'|| key=='categories' || key=='name'|| key=='address'|| key=='area_sqyard')
                    {
                        finalInfoArray.push({name:capFL(key), value:(key == 'creation_date')?`${feature.properties[key].split('T')[0]} ${feature.properties[key].split('T')[1].substring(0, 5)}` :feature.properties[key]});
                    }
                })
                setAttrInfo(finalInfoArray);
                showInfoBox();
            }
            else
            {
                lyrhighlighter ? m.removeLayer(lyrhighlighter):false;
                hideInfoBox();
            }
    
            }).catch(err=>{
            });   
        });

    }