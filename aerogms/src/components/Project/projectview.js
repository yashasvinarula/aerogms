import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { Navbar, NavItem, Image, DropdownButton, MenuItem, Modal, Button, Table, Tabs, Tab } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import MediaQuery from 'react-responsive';
import Layer from './layer';
import Chat from './specificQuery';
import BottomDrawer from './bottom-drawer';
import Analytics from './analytics';
import Validation from './validation';
import LayersPNG from '../../images/layers.png';
import LeftArrow from '../../images/LeftArrow.png';
import CrossIcon from '../../images/CrossIcon.png';
import '../../css/project.css';
import addLayer from '../../images/AddLayerPNG.png';
import paytm from '../../images/paytm.png';
import phonepay from '../../images/phonepay.png';
import buddy from '../../images/buddy.png';
import bhim from '../../images/bhim.png';
import tez from '../../images/tez.png';
import importLayer from '../../images/ImportLayerPNG.png';
import {create_layer, rename_layer, get_layers, addUserComplaint, makelayerafterimport, makeLayerActive} from '../../actions'
import _ from 'lodash';
import axios from 'axios';
import SpecificQuery from './specificQuery';
import { throws } from 'assert';
import {BASE_URL} from '../../config';

const queryList = [
    {
        aero_id : 1234,
        query_id : 1234,
        date : '21 May, 2018',
        subject : 'First complaint',
        status : 'Pending',
        description : 'First complaint in query list'
    }
];

const attrInfoList = [
    {name : 'aero_id', value : '22'},
    {name : 'Area', value : '1234'},
    {name : 'Perimeter', value : '4567'},
    {name : 'date', value : '23 July, 2018'},
];

const AddLayer = (
    <div className="icons-display text-center col-xs-6">
        <Image src={addLayer} className="add-import-icons" />
        <span className="margin-outside">Add Layer</span>
    </div>
);

class ProjectView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            more : false,
            slider : 'slider',
            close : 'close',
            sliderPartial : 'slider-partial',  
            showImportModal : false,
            showAddLayerModal : false,
            showPaymentModal:false,
            layerType : '',
            layer : {visible : '', name : '', orig_name:'', type : '', color : '', strokeColor : '', lay_id:''},
            //layers : [],
            layerList : false,
            analytics : false,
            validation : false,
            info : true,
            showVisibles : false,
            showFeatures : false,
            infoBoxShow:false,
            compBoxShow:false,
            compboxvalue:'',
            queryTable : false,
            pro_id:'',
            editReq : false,
            queryForm : false,
            queryType : '',
            tabKey : 1, // for list of complaints and specific complaint
            queryList : queryList, // list of all types queries
            currentQueryIndex : 0, //index for current query row selected by default for 1st query row
            showSpecificQuery : true, // for showing specific query by default true for showing first query
            enableNext : 'prev-next-btn', // to enable css class on next button
            enablePrev : 'disable-btn', // to enable css class on previous button
            //drawingTools : [{pointBtn : false}, {lineBtn : false}, {polygonBtn : false}, {saveLayerBtn : false}, {remFeature : false}],
            attrInfoList:[],
            gotouserdash:false,
            editAttributes : false, // to enable attributes edit mode
            updatedAttr : {name : null, value : null}, // updated attr which will be newly inserted
            showLQueryBox: false,
            taxMap:false,
        }

        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeAddLayerModal = this.closeAddLayerModal.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
        this.saveLayer = this.saveLayer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.openFullDrawer = this.openFullDrawer.bind(this);
        this.openPartialDrawer = this.openPartialDrawer.bind(this);
        this.showCompBox = this.showCompBox.bind(this);
        this.submitComplaint = this.submitComplaint.bind(this);
        this.getCompBoxValue = this.getCompBoxValue.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.closePaymentModal = this.closePaymentModal.bind(this);
        this.getLayerDataFromJS = this.getLayerDataFromJS.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.showNextQuery = this.showNextQuery.bind(this);
        this.showPreviousQuery = this.showPreviousQuery.bind(this);
        this.getAttrInfo = this.getAttrInfo.bind(this);
        this.showInfoBox = this.showInfoBox.bind(this);
        this.hideInfoBox = this.hideInfoBox.bind(this);
        this.deleteTempLayer = this.deleteTempLayer.bind(this);
        this.showRespectiveButtons =this.showRespectiveButtons.bind(this);
        this.createNewLayer = this.createNewLayer.bind(this);
        this.GoToUserDash = this.GoToUserDash.bind(this);
        this.updateAttributes = this.updateAttributes.bind(this);
    }
    
   
    renderAttrInfo() {
        if(this.state.attrInfoList.length>0)
        {
            if(!this.state.editAttributes) {
                    return this.state.attrInfoList.map((item) => {
                        return (<tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{item.value}</td>
                                </tr>)
                    });
            } else {
              
                return this.state.attrInfoList.map((item) => {
                    if(item.name === 'Aero_id' || item.name === 'Creation_date'){
                        return (<tr key={item.name}>
                            <td>{item.name}</td>
                            <td id={item.name}>{item.value}</td>
                        </tr>)
                    } else {
                        return (<tr key={item.name}>
                            <td>{item.name}</td>
                            <td><input id={item.name} name={item.name} defaultValue={item.value} /></td>
                        </tr>)
                    }
                });
            }
        }
    }
    updateAttributes() {
        if(this.state.editAttributes === true)
        {
            var that =this;
            let attrList = [...this.state.attrInfoList];
            let updatedList = [];
            attrList.map((item) => {
                let attribute = {name : null, value : null};
                attribute.name = item.name;
                if(item.name==='Aero_id' || item.name === 'Creation_date')
                {
                    attribute.value = document.getElementById(item.name).innerText;
                }
                else
                {
                    attribute.value = document.getElementById(item.name).value;
                }

                updatedList.push(attribute);
            });

            this.servicecaller('update_layer_attrib', {layer:this.props.activelayerdata.activeLayer, attrib:updatedList}, function(err, data){
                if(!err && data){
                    //updatedList=[];
                    alert(data.message);
                    that.setState({attrInfoList:[...updatedList], editAttributes : false});

                }
                else{
                    if(err.status === 'unauthorised')
                    {
                        err.message?alert(err.message):'';
                        that.props.doLogout();
                    }
                    else{
                        err.message?alert(err.message):'';
                    }
                }
            });
        }
    }
    getAttrInfo(infoArr){
        if(infoArr.length>0){
            this.setState({attrInfoList:infoArr});
        }
    }
    handleSelect(tabKey) {
        this.setState({tabKey});
    }
    selectRow(item) {
        let currentRowIndex = this.state.queryList.findIndex(queryItem => queryItem.query_id.toString() === item._dispatchInstances.key);
        if(currentRowIndex !== -1) {
            if(currentRowIndex === 0) {
                this.setState({tabKey : 2, currentQueryIndex : currentRowIndex, 
                    showSpecificQuery : true, enableNext : 'prev-next-btn', 
                    enablePrev : 'disable-btn'});
            } else if( currentRowIndex === this.state.queryList.length -1) {
                this.setState({tabKey : 2, currentQueryIndex : currentRowIndex, 
                    showSpecificQuery : true, enableNext : 'disable-btn', 
                    enablePrev : 'prev-next-btn'});
            } else if(currentRowIndex > 0 && currentRowIndex < this.state.queryList.length - 1) {
                this.setState({tabKey : 2, currentQueryIndex : currentRowIndex, 
                    showSpecificQuery : true, enableNext : 'prev-next-btn', 
                    enablePrev : 'prev-next-btn'});
            }
        }
        else 
            return;
    }
    showNextQuery() {
        let index = this.state.currentQueryIndex;
        if(index < this.state.queryList.length - 1) {
            index++;
            this.setState({currentQueryIndex : index, enableNext : 'prev-next-btn', enablePrev : 'prev-next-btn'});
        } else if(index === this.state.queryList.length - 1) {
            this.setState({enableNext : 'disable-btn', enablePrev : 'prev-next-btn'});
        }
    }
    showPreviousQuery() {
        let index = this.state.currentQueryIndex;
        if(index > 0) {
            index--;
            this.setState({currentQueryIndex : index, enableNext : 'prev-next-btn', enablePrev : 'prev-next-btn'});
        } else if(index === 0) {
            this.setState({enableNext : 'prev-next-btn', enablePrev : 'disable-btn'});
        }
    }
    closeDrawer() {
        this.setState({ close : 'close', sliderPartial : '', slider : '', more : false });
    }
    openFullDrawer() {
        this.setState({ close : '', sliderPartial : '', slider : 'slider', more : false});
    }
    openPartialDrawer() {
        this.setState({close : '', sliderPartial : 'slider-Partial', slider : '', more : true });
    }

    componentDidMount(){
        window.getLayerDataFromJS = this.getLayerDataFromJS;
        window.setAttrInfo = this.getAttrInfo;
        window.showInfoBox = this.showInfoBox;
        window.hideInfoBox = this.hideInfoBox;
    }
    componentWillMount () {
        let pid = window.initMap();
        this.setState({pro_id:pid});
        if(Object.keys(this.props.layers).length === 0){
            if(pid != null && pid !== undefined){
                this.props.get_layers(pid, this.props.userDetails.email);
            }
        }
    }
    closeImportModal() {
        this.setState({ showImportModal : false});
    }
    closeAddLayerModal() {
        this.setState({ showAddLayerModal : false });
    }
    hideLayerbtns(){
        ['btnMakePoint', 'btnMakeLine', 'btnMakePolygon', 'saveLayer', 'removeFeature'].map(btn =>{
            if(document.getElementById(btn)){
                document.getElementById(btn).className='hide-btn';
            }
        });
    }
    showRespectiveButtons(lay_type){
        this.hideLayerbtns();
        switch(lay_type){
            case 'Point':
                {
                    document.getElementById('btnMakePoint') ? document.getElementById('btnMakePoint').className='show-btn':'';
                    document.getElementById('saveLayer') ? document.getElementById('saveLayer').className='show-btn':'';
                    break;
                }
            case 'Linestring':
                {
                    document.getElementById('btnMakeLine') ? document.getElementById('btnMakeLine').className='show-btn':'';
                    document.getElementById('saveLayer') ? document.getElementById('saveLayer').className='show-btn':'';
                    break;
                }
            case 'LineString':
                {
                    document.getElementById('btnMakeLine') ? document.getElementById('btnMakeLine').className='show-btn':'';
                    document.getElementById('saveLayer') ? document.getElementById('saveLayer').className='show-btn':'';
                    break;
                }
            case 'Polygon':
                {
                    document.getElementById('btnMakePolygon') ? document.getElementById('btnMakePolygon').className='show-btn':'';
                    document.getElementById('saveLayer') ? document.getElementById('saveLayer').className='show-btn':'';
                    break;
                }
            default:
                    break;
        }
    }
    GoToUserDash(){
       this.setState({gotouserdash:true});
    }
    servicecaller(ser_name, data, callback){
        axios.post(`${BASE_URL}/${ser_name}`, data)
        .then(response=>{
            if(response.data.status === 'success'){
                callback(false, response.data);
            }
            else{
                callback(response.data, undefined);
            }
        })
        .catch(err=>{
            console.log('error: ' + err)
            callback(err.response.data, undefined);
        })
    }

    addLayer() {
        let that = this;
            let newLayerTitle = document.getElementById('layer-title').value;
            newLayerTitle = isNaN(parseInt(newLayerTitle.substr(0,1))) && newLayerTitle.length > 0 && newLayerTitle.indexOf(' ') == -1 && newLayerTitle.indexOf('-') == -1? newLayerTitle.trim().toLowerCase():'';
            if(!newLayerTitle)
            {
                alert('layer name shouldn\'t have any space, hyphen and numbers in the starting!');
                return;    
            }
        
        if(newLayerTitle !== ''){
            axios.post(`${BASE_URL}/lay_name_exists`, {
                lay_name: newLayerTitle
            })
            .then(responce=>{
                if(responce.data.status === 'not exists'){
                    if(Object.keys(that.props.layers).length>0){
                        _.map(that.props.layers, layer=>{
                            if(layer.lay_id === ''){
                                delete that.props.layers[layer.name];
                            }
                        })
                    }
                    let newLayer={}; //= this.state.layer;
                    newLayer.visible = true;
                    newLayer.name = newLayerTitle;
                    newLayer.orig_name = newLayerTitle;
                    newLayer.lay_id = '';
                    newLayer.type = that.state.layerType;
                    newLayer.color = '0000ff';
                    that.setState({ layer : newLayer });
                    //let newLayers = this.state.layers;
                    //newLayers.push(newLayer);
                    //this.setState({ ...this.statelayers, newLayer });
                    //{"point113":{"name":"point113","type":"Point","visible":true}}
                    that.props.layers[newLayerTitle] = newLayer;
                    //that.setState({activelayerdata:{activeLayer:newLayer.orig_name, activeLayer_id:'', activeLayer_type:newLayer.type, activeLayer_box:''}});
                    that.closeAddLayerModal();
                    that.createNewLayer(that.state.layerType);
                    that.props.makeLayerActive({activelayerdata:{activeLayer:newLayer.orig_name, activeLayer_id:'', activeLayer_type:newLayer.type, activeLayer_box:''}});
                    that.showRespectiveButtons(that.state.layerType);
                }
                else if(responce.data.status === 'unauthorised')
                {
                    responce.data.message ? alert(responce.data.message):'';
                    this.props.doLogout();
                }
                else{
                    alert('layer name is already exists! Please try with another name.')
                }
            })
            .catch(err=>{
                console.log('error: ' + err);
            })
        }
        else{
            alert('Please enter layer name/title!');
        }
    }
    closePaymentModal(){
        this.setState({showPaymentModal:false});
    }
    deleteTempLayer(templayer){
        delete this.props.layers[templayer];
        window.resetNewLayer();
        this.hideLayerbtns();
    }
    renderLayers() {
        if(Object.keys(this.props.layers).indexOf('error') > -1)
        {
            let {message, status} = this.props.layers.error;
            message ? alert(message):'';
            delete this.props.layers['error'];
            if(status === 'unauthorised')
            {
                this.props.doLogout();
            }
        }
        if(Object.keys(this.props.layers).length>0){
            return _.map(this.props.layers, layer=>{
                return (<li key={layer.orig_name}><Layer layer={layer} changeLayerNameParent={(name)=>{this.props.rename_layer(layer.lay_id, name)}}  setActiveLayer={(box)=>{this.props.makeLayerActive({activelayerdata:{activeLayer:layer.orig_name, activeLayer_id:layer.lay_id, activeLayer_type:layer.type, activeLayer_box:box}});this.createNewLayer(layer.type);window.zoomTo(box)}} resetActiveLayer={()=>{window.lyrhighlighter ? window.m.removeLayer(window.lyrhighlighter):'';this.props.makeLayerActive({activelayerdata:{activeLayer:'', activeLayer_id:'', activeLayer_type:'', activeLayer_box:''}})}} deleteTempLayer={(name)=>{this.deleteTempLayer(name)}} doLogout={()=>{this.props.doLogout()}}/></li>);
            })
        }
    }
    createNewLayer(type){
        if(type)
        {
            window.lyrhighlighter ? window.m.removeLayer(window.lyrhighlighter):false;
            this.setState({infoBoxShow:false});
            window.createNewLayer(type);
        }
    }
    addPoint(){
        window.addPoint();
    }
    addLine(){
        window.addLine();
    }
    addPolygon(){
        window.addPolygon();
    }
    saveLayer(){
        var latlngArray;
        let that = this;
        //latlngArray =  window.saveLayer(this.state.layer.type, this.state.layer.name);
        latlngArray =  window.saveLayer(this.props.activelayerdata.activeLayer_type, this.props.activelayerdata.activeLayer);
        if(latlngArray !== null && latlngArray !== undefined){      
            //this.setState({activeLayer:''});
            if(latlngArray.latlngs.length > 0 && latlngArray.type == 'Point')
            {
                delete this.props.layers[this.state.layer.name];
                if(this.props.activelayerdata.activeLayer_id){
                    this.servicecaller('exis_layer_insert', {name:latlngArray.layer_name, type:latlngArray.type, geom:latlngArray.latlngs}, function(err, data){
                        if(!err && data){
                            window.updateWMSLayer(that.props.activelayerdata.activeLayer);
                            that.createNewLayer(that.props.activelayerdata.activeLayer_type);
                            data.data?alert(data.data):'';
                        }
                        else{
                            if(err.status === 'unauthorised')
                            {
                                err.message?alert(err.message):'';
                                that.props.doLogout();
                            }
                            else{
                                err.message?alert(err.message):'';
                            }
                        }
                    });
                }
                else{
                    this.hideLayerbtns();
                    this.props.create_layer(latlngArray.layer_name, latlngArray.type, latlngArray.pro_id, this.props.userDetails.email, latlngArray.latlngs);
                }
            }
            else if(latlngArray.latlngs.length > 0 && (latlngArray.type == 'Linestring'|| latlngArray.type == 'LineString'))
            {
               if(latlngArray.status === 'success')
               {
                var stringArray = [];
                var lnglatString = '';
                latlngArray.latlngs.map((array1)=>{
                    array1.map((latlon, i, arr)=>{
                        if(i <= arr.length-1){
                            lnglatString += latlon.lng + '@' + latlon.lat + '@'
                        }
                    })
                    stringArray.push(lnglatString);
                    lnglatString = '';
                })
                delete this.props.layers[this.state.layer.name];
                if(this.props.activelayerdata.activeLayer_id){
                    this.servicecaller('exis_layer_insert', {name:latlngArray.layer_name, type:latlngArray.type, geom:stringArray}, function(err, data){
                        if(!err && data){
                            window.updateWMSLayer(that.props.activelayerdata.activeLayer);
                            that.createNewLayer(that.props.activelayerdata.activeLayer_type);
                            alert(data.data);
                        }
                        else{
                            if(err.status === 'unauthorised')
                            {
                                err.message?alert(err.message):'';
                                that.props.doLogout();
                            }
                            else{
                                err.message?alert(err.message):'';
                            }
                        }
                    });
                }
                else{
                    this.hideLayerbtns();
                    this.props.create_layer(latlngArray.layer_name, latlngArray.type, latlngArray.pro_id, this.props.userDetails.email, stringArray);
                }
                stringArray = null;
               }
               else{
                    alert('all line should have valid geometry or should have atleast 2 different points!');
                    return;
                }
            }
            else if(latlngArray.latlngs.length > 0 && latlngArray.type == 'Polygon')
            {
                if(latlngArray.status==='success')
                {
                    var stringArray = [];
                var lnglatString = '';
                latlngArray.latlngs.map((array1)=>{
                    array1.map((array2)=>{
                         array2.map((latlon, i, arr)=>{
                            if(i <= arr.length-1)
                            {
                                lnglatString += latlon.lng + '@' + latlon.lat + '@'
                            }
                            if(i === arr.length-1){
                                lnglatString += arr[0].lng + '@' + arr[0].lat + '@'
                            }
                        })
                     })
                    stringArray.push(lnglatString);
                    lnglatString = '';
                })
                delete this.props.layers[this.state.layer.name];
                if(this.props.activelayerdata.activeLayer_id){
                    this.servicecaller('exis_layer_insert', {name:latlngArray.layer_name, type:latlngArray.type, geom:stringArray}, function(err, data){
                        if(!err && data){
                            window.updateWMSLayer(that.props.activelayerdata.activeLayer);
                            that.createNewLayer(that.props.activelayerdata.activeLayer_type);
                            alert(data.data);
                        }
                        else{
                            if(err.status === 'unauthorised')
                            {
                                err.message?alert(err.message):'';
                                that.props.doLogout();
                            }
                            else{
                                err.message ? alert(err.message):'';
                            }
                        }
                    });
                }
                else{
                    this.hideLayerbtns();
                    this.props.create_layer(latlngArray.layer_name, latlngArray.type, latlngArray.pro_id, this.props.userDetails.email, stringArray);
                }
                }
                else{
                    alert('all polygon should have valid geometry or should have atleast 3 points!');
                    return;
                }
            }
        }
        
    }
    removeFeature(){
        window.removeSelFeature();
    }

    showCompBox(){
        this.setState({compBoxShow:!this.state.compBoxShow});
        this.setState({compboxvalue:''});
    }

    submitComplaint(){
        let comp_val = this.state.compboxvalue.trim();
        let feaInfo = window.getSelectedFeaValue();
        feaInfo['complaint'] = comp_val;
        feaInfo['comp_id'] = 100 + parseInt(feaInfo.sid);
        feaInfo['date'] = new Date().toLocaleString();
        feaInfo['status'] = 'Pending';
        this.props.addUserComplaint(feaInfo);
        this.setState({compBoxShow:false});
        alert('Complaint is received with id:' + feaInfo['comp_id']);
    }

    getCompBoxValue(e) {
        this.setState({ 
            compboxvalue: e.target.value 
        });
      }

    getTableData(){
        
        if(Object.keys(this.props.userComplaint).length>0){
            return  _.map(this.props.userComplaint, complaint=>{
                return (<tr><td>{complaint.sid}</td>
                <td>{complaint.comp_id}</td>
                <td>{complaint.complaint}</td>
                <td>{complaint.date}</td>
                <td>{complaint.status}</td></tr>)
            })
        }
        else{
            alert('There is no complaints!');
            this.setState({queryTable : false});
        }
    }

    getLayerDataFromJS(data){
        if(data){
            this.props.makelayerafterimport(data);
        }
    }
    hideInfoBox(){
        this.setState({infoBoxShow:false});
    }
    showInfoBox()
    {
        this.setState({infoBoxShow:true});
    }

    render(){
        // const { from, to } = this.state;
        // const modifiers = { start: from, end: to };
        // if(!this.props.userDetails.isLoggedIn)
        // {
        //     window.wmsLayers=[];
        //     document.getElementById('map').style.display='none';
        //     return <Redirect to={{pathname:'/login'}}/>
        // }
        // if(this.state.gotouserdash)
        // {
        //     window.wmsLayers=[];
        //     document.getElementById('map').style.display='none';
        //     return <Redirect to='/userDashboard' />
        // }
        if(this.props.activelayerdata.activeLayer){
            //let pre_act_lay_id = window.activeMapLayer_id;
            // if(pre_act_lay_id){
            //     document.getElementById(pre_act_lay_id).click();
            // }
            window.activeMapLayer = this.props.activelayerdata.activeLayer;
            window.activeMapLayer_id = this.props.activelayerdata.activeLayer_id;
            //window.zoomTo(this.props.activelayerdata.activeLayer_box);
            if(this.props.activelayerdata.activeLayer){
                this.showRespectiveButtons(this.props.activelayerdata.activeLayer_type);
            }
           _.map( this.props.layers, layer=>{
                if(document.getElementById(layer.orig_name))
                document.getElementById(layer.orig_name).className='';
            })
            if(document.getElementById(this.props.activelayerdata.activeLayer))
            document.getElementById(this.props.activelayerdata.activeLayer).className='layerHL';
        }
        else{
            if(Object.keys(this.props.layers).length>0){
                window.activeMapLayer='';
                window.activeMapLayer_id ='';
                window.resetNewLayer();
                this. hideLayerbtns();
                _.map( this.props.layers, layer=>{
                    if(document.getElementById(layer.orig_name))
                    document.getElementById(layer.orig_name).className='';
                })
            }
            if(this.state.infoBoxShow && !(this.state.attrInfoList.length>0))
                 this.setState({infoBoxShow:false});
        }
        let drawerStates={};
        drawerStates.slider = this.state.slider;
        drawerStates.more = this.state.more;
        drawerStates.sliderPartial = this.state.sliderPartial;
        drawerStates.close = this.state.close;
        return (
            <MediaQuery maxWidth={768}>
                {(matches) => {
                    if(matches) {
                        return (
                            <div className="">
                                <div className="project-nav">
                                    {
                                        this.state.layerList ?
                                        (<Image src={LeftArrow} onClick={() => this.setState({ layerList : false})} className="image-left menu-item"/>)
                                        : ''
                                    }
                                    {
                                     !this.state.layerList ? 
                                        (<div>
                                            <Menu className="project-menu" width={'40%'}>
                                                <a id="home" className="menu-item" href="/dashboard">Users</a>
                                                <a id="home" className="menu-item"
                                                    onClick={() => this.setState({analytics : true, validation : false})} 
                                                >Analytics</a>
                                                <a id="home" className="menu-item" 
                                                    onClick={() => this.setState({validation : true, analytics : false})} 
                                                >Validation</a>
                                                <a id="home" className="menu-item" 
                                                    onClick={() => this.setState({map : true, layerList : false, validation : false, analytics : false})}
                                                >Map</a>
                                            </Menu>
                                            <Image src={LayersPNG} 
                                                onClick={() => this.setState({layerList : true, validation : false, analytics : false})} 
                                                className="image layers-image" 
                                            />
                                        </div>) 
                                        : ''
                                    }
                                </div>
                                {
                                    this.state.layerList ? 
                                    (<div className="project-layer-box">
                                        <div>
                                            <h4 className="text-center ">Project Title</h4>
                                        </div>
                                        <hr className="separator-line"></hr>
                                        <div className="row">
                                            <div className="icons-display on-hover text-center col-xs-6 left-padding" onClick={() => this.setState({ showImportModal : true })}>
                                                <Image src={importLayer} className="add-import-icons " />
                                                <span className="margin-outside">Import Layer</span>
                                            </div>
                                            <Modal
                                                show={this.state.showImportModal}
                                                onHide={this.closeImportModal}
                                                container={this}
                                            >
                                                <Modal.Header closeButton>Choose a file to import</Modal.Header>
                                                <Modal.Body>
                                                    <Button onClick={(e) => this.myInput.click() }>Select a file from your computer</Button>
                                                    <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} />
                                                </Modal.Body>
                                            </Modal>
                                            <DropdownButton 
                                                bsStyle="default"
                                                noCaret
                                                title={AddLayer}
                                                id="dropdown-no-caret" >
                                                <style type="text/css">{`
                                                            .btn-default {
                                                                border-color : #fff;
                                                            }
                                                            .btn {
                                                                padding : 0px;
                                                            }
                                                            .dropdown {
                                                               float : none !important;
                                                            }
                                                        `}</style>
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Point'})}>Point</MenuItem>
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Linestring'})}>Line</MenuItem>
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Polygon'})}>Polygon</MenuItem>
                                                <Modal
                                                    show={this.state.showAddLayerModal}
                                                    onHide={this.closeAddLayerModal}
                                                    container={this}
                                                >
                                                    <Modal.Header closeButton>Enter Layer Title</Modal.Header>
                                                    <Modal.Body>
                                                        <label htmlFor="layerTitle">Enter Title</label>
                                                        <input type="text" id="layer-title"/>
                                                        <Button onClick={this.addLayer}>Save</Button>
                                                    </Modal.Body>
                                                </Modal>
                                            </DropdownButton>
                                        </div>
                                        <hr className="separator-line"></hr>
                                        <div>
                                            <ul>
                                                {this.renderLayers()}
                                            </ul>
                                            {/* <ul id="group1" className="">
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                            </ul> */}
                                        </div>
                                        
                                        {
                                            this.state.layers.length !== 0 
                                            ? ( <div className="bottom-layers-panel">
                                                    <ul className="row">
                                                        <li className="col-xs-6" onClick={() => this.setState({info : true})} >Info</li>
                                                        <li className="col-xs-6" onClick={() => this.setState({info : false})} >Visibility</li>
                                                    </ul>
                                                </div>)
                                            : ''
                                        }
                                    </div>)
                                    : (<div>
                                        <Button className="bottom-drawer-button" onClick={this.openPartialDrawer}>Show Drawer</Button>
                                        <BottomDrawer className="bottom-drawer-bar" 
                                            closeDrawer={this.closeDrawer} 
                                            openFullDrawer={this.openFullDrawer} 
                                            drawerStates={drawerStates}
                                        />
                                    </div>)
                                } 
                                {
                                    this.state.analytics ?
                                    (<Analytics />)
                                    : ''
                                } 
                                {
                                    this.state.validation ?
                                    (<Validation />)
                                    : ''
                                }

                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <Navbar fixedTop style={{backgroundColor:'#9096a0'}}>
                                    {
                                            (<NavItem className="nav-items"><input type="button" id="btnMakePoint" className="hide-btn"
                                            value="AddPoint" onClick={this.addPoint}/></NavItem>)
                                    }
                                    { 
                                            (<NavItem className="nav-items layer-btn"><input type="button" id="btnMakeLine" className="hide-btn"
                                            value="AddLine" onClick={this.addLine}/></NavItem>)
                                    }
                                    {
                                            (<NavItem className="nav-items layer-btn"><input type="button" id="btnMakePolygon" className="hide-btn"
                                            value="AddPolygon" onClick={this.addPolygon}/></NavItem>)  
                                    }  
                                    {
                                            (<NavItem className="nav-items layer-btn"><input type="button" id="removeFeature" className="hide-btn"
                                            value="Remove Feature" onClick={this.removeFeature}/></NavItem>)
                                    }  
                                    {
                                            (<NavItem className="nav-items layer-btn"><input type="button" id="saveLayer" className="hide-btn"
                                            value="Save Layer" onClick={this.saveLayer}/></NavItem>)
                                    }   
                                    <NavItem className="nav-items"><input className="btnLogout" type="button" value="Logout" onClick={this.props.doLogout}/></NavItem>
                                    <NavItem className="nav-items"><input className="btnLogout" type="button" value="Dashboard" onClick={()=>{this.GoToUserDash()}}/></NavItem>
                                    <NavItem className="nav-items"><input className="btnLogout" type="button" value="Layer Query" onClick={()=>{this.state.showLQueryBox?this.setState({showLQueryBox:false}):this.setState({showLQueryBox:true})}}/></NavItem>
                                    {/* <NavItem className="nav-items"><input className="btnLogout" type="button" value="Tax Map" onClick={()=>{this.state.taxMap?this.setState({taxMap:false}):this.setState({taxMap:true})}}/></NavItem> */}
                                    <NavItem className="nav-items" onClick={() => { return <Redirect to="/propertytax" /> }}><input className="btnLogout" type="button" value="Tax Map" /></NavItem>
                                    {/* <NavItem className="nav-items"><input className="tempButnWid" type="button" value="Query Dashboard" 
                                        onClick={()=>{this.setState({queryTable : true})}}/></NavItem> */}
                                </Navbar>
                                {
                                    this.state.queryTable ?
                                    (
                                    <div className="table-div">    
                                        <div className="query-table-div" id="divCompTable">
                                        <Image onClick={() => this.setState({queryTable : false, tabKey : 1})} src={CrossIcon} className="table-cross-icon" />
                                            <Tabs
                                                activeKey={this.state.tabKey}
                                                onSelect={this.handleSelect}
                                                id="query-tab"
                                            >
                                                <Tab eventKey={1} title="Queries">
                                                    <Table striped className="query-table">
                                                        <caption>My Dashboard</caption>
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center">AeroId</th>
                                                                <th className="text-center">Query.Id</th>
                                                                <th className="text-center">Date</th>
                                                                <th className="text-center">Subject</th>
                                                                <th className="text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.queryList.map((item) => {
                                                                    return (
                                                                        <tr key={item.query_id} className="query-row" onClick={this.selectRow}>
                                                                            <td>{item.aero_id}</td>
                                                                            <td>{item.query_id}</td>
                                                                            <td>{item.date}</td>
                                                                            <td>{item.subject}</td>
                                                                            <td>{item.status}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey={2} title="Specific Query">
                                                {
                                                    this.state.showSpecificQuery ? 
                                                        (<SpecificQuery next={this.showNextQuery} 
                                                            prev={this.showPreviousQuery} 
                                                            query={this.state.queryList[this.state.currentQueryIndex]} 
                                                            enableNext={this.state.enableNext}
                                                            enablePrev={this.state.enablePrev}
                                                        />)
                                                    : ''
                                                }
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </div>
                                    )
                                    : ''
                                }
                                    
                            <div className=""> </div>
                            <div className="project-layer-box">
                                <div>
                                    <h4 className="text-center">Project Title</h4>
                                </div>
                                <hr className="separator-line"></hr>
                                <div className="row">
                                    <div className="icons-display on-hover text-center col-xs-6 left-padding" onClick={() =>{document.getElementById('divImportLayer').style.display='block';}}>
                                        <Image src={importLayer} className="add-import-icons " />
                                        <span className="margin-outside">Import Layer</span>
                                    </div>
                                                
                                    <DropdownButton 
                                        bsStyle="default"
                                        noCaret
                                        title={AddLayer}
                                        id="dropdown-no-caret" >
                                        <style type="text/css">{`
                                                    .btn-default {
                                                        border-color : #fff;
                                                    }
                                                    .btn {
                                                        padding : 0px;
                                                    }
                                                    .dropdown {
                                                       float : none !important;
                                                    }
                                                `}</style>
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Point'})}>Point</MenuItem>
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Linestring' })}>Line</MenuItem>
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Polygon'})}>Polygon</MenuItem>
                                        <Modal className="modal-custom"
                                            show={this.state.showAddLayerModal}
                                            onHide={this.closeAddLayerModal}
                                            container={this}
                                        >
                                            <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                            <Modal.Body>
                                                <input type="text" id="layer-title" placeholder="Enter Name"/>
                                                <Button onClick={()=>{this.addLayer()}}>Save</Button>
                                            </Modal.Body>
                                        </Modal>
                                    </DropdownButton>
                                </div>
                                <hr className="separator-line"></hr>
                                <div id="divImportLayer" className="layer-upload">
                                                    <Image src={CrossIcon} className="cross-icon" onClick={()=>{document.getElementById('divImportLayer').style.display='none';}} />
                                                    <form id="frmUploader" encType="multipart/form-data" action="/api/fileupload" method="post">
                                                        <input className="upload-btn" type="file" name={'pro_id:'+this.state.pro_id} multiple/>
                                                        <input className="upload-btn" type="submit" name="submit" id="btnSubmit" value="Upload" />
                                                    </form>
                                                    <div id="divloader" className="loader">
                                                        <img src="./images/loader.gif" alt="loader" className="loaderImg"/>
                                                    </div>
                                                </div>
                                <div>
                                    <ul id="group1">
                                        {this.renderLayers()}
                                    </ul>
                                </div>
                            </div>
                            <div  id="infoDiv" className={this.state.infoBoxShow ? 'project-infobox':'project-infobox infoDiv'}>    
                            {/* <div  id="infoDiv" className="project-infobox">    */}
                                <Image src={CrossIcon} className="cross-icon" onClick={()=>this.setState({infoBoxShow:false})}/>
                                <h3 className="text-center">Info Panel</h3>
                                <Button onClick={() => {this.state.editAttributes?this.setState({editAttributes : false}):this.setState({editAttributes : true})}}>Edit Attributes</Button>
                                <Button onClick={this.updateAttributes} >Save</Button>
                                <Table striped className="info-panel-attr-list scroll">
                                    <caption className="text-center">Attributes Information</caption>
                                    <thead>
                                        <tr>
                                            <th className=" text-center">Name</th>
                                            <th className=" text-center">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody id="attr-tbody">
                                        {
                                           this.renderAttrInfo()
                                        }
                                    </tbody>
                                </Table>
                               
                                {
                                    !this.state.queryForm ?
                                        (
                                            // <DropdownButton
                                            //     bsStyle="default"
                                            //     id="dropdown-default"
                                            //     title={`Interact with Admin`}
                                            //     className="query-list-dropdown"
                                            // >
                                            //     <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Suggestion'})}>Suggestion</MenuItem>
                                            //     <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Complaint'})}>Complaint</MenuItem>
                                            //     <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Question'})}>Question</MenuItem>
                                            //     <MenuItem onClick={() => this.setState({queryForm : true, editReq : true})}>Edit Request</MenuItem>
                                            // </DropdownButton>
                                            true
                                        )
                                    :   
                                        !this.state.editReq ? 
                                            (
                                                <form className="query-form">
                                                    <h4 className="text-center">{this.state.queryType}</h4>
                                                    {/* <hr /> */}
                                                    <label>Subject</label>
                                                    <textarea type="text" className="textArea" placeholder="Enter subject here"></textarea>
                                                    <label>Description</label>
                                                    <textarea type="text" className="textArea custom-height" placeholder="Enter description here"></textarea>
                                                    <Button className="query-form-btn cancel-btn" onClick={() => this.setState({queryForm : false, queryType : ''})}>Cancel</Button>
                                                    <Button className="query-form-btn submit-btn">Submit</Button>
                                                </form>
                                            )
                                        :
                                            (
                                                <form className="query-form">
                                                    <label>Specify Attribute Name</label>
                                                    <select size={this.state.size}>
                                                        <option value="">Choose Attribute</option>
                                                        <option value="">Area</option>
                                                        <option value="">Population</option>
                                                        <option value="">Perimeter</option>
                                                        <option value="">Choose Attribute</option>
                                                        <option value="">Area</option>
                                                        <option value="">Population</option>
                                                        <option value="">Perimeter</option>
                                                        <option value="">Choose Attribute</option>
                                                        <option value="">Area</option>
                                                        <option value="">Population</option>
                                                        <option value="">Perimeter</option>
                                                        <option value="">Choose Attribute</option>
                                                        <option value="">Area</option>
                                                    </select>
                                                    <label>Current value</label>
                                                    <input readOnly></input>
                                                    <label>Specify new value</label>
                                                    <input type=""></input>
                                                    <label>Please specify reason</label>
                                                    <textarea type="text" className="textArea custom-height" placeholder="Enter here"></textarea>
                                                    <Button className="query-form-btn cancel-btn" onClick={() => this.setState({editReq : false, queryForm : false})}>Cancel</Button>
                                                    <Button className="query-form-btn submit-btn">Submit</Button>
                                                </form>
                                            ) 
                                }
                                <div id="infoText">
                                </div>
                                {/* <br/> */}
                                {/* <input id="btnAddComp" type="Button" value="Add Complaint" onClick={this.showCompBox}></input>
                                <input style={{marginLeft:5, marginTop:10, visibility:"true"}}  type="button" id="hideInfo" value="Payment" onClick={()=>{this.setState({showPaymentModal:true})}}/> */}
                                        <Modal 
                                                show={this.state.showPaymentModal}
                                                onHide={this.closePaymentModal}
                                                container={this}
                                            >
                                            <style type="text/css">{
                                                `.modal-content{width:240px}`
                                            }</style>
                                                <Modal.Header closeButton>Select a payment option</Modal.Header>
                                                <Modal.Body>
                                                   <div> 
                                                      <Image className="imageBorder" src={paytm}></Image>
                                                      <Image className="imageBorder" src={phonepay}></Image>
                                                      <Image className="imageBorder" src={buddy}></Image>
                                                      <Image className="imageBorder" src={bhim}></Image>
                                                      <Image className="imageBorder" src={tez}></Image>
                                                   </div>
                                                </Modal.Body>
                                            </Modal>

                                {/* <br/><hr/> */}
                                <div id="divCompBox" className={this.state.compBoxShow? '':'comp-box-div'}>
                                    <div>
                                        <textarea id="taCompDesc" onChange={this.getCompBoxValue} type="text" value={this.state.compboxvalue} className="text-area"></textarea>
                                    </div>
                                    <input type="Button" value="submit" onClick={this.submitComplaint}></input>
                                    <input style={{marginLeft:5, marginTop:10, visibility:"true"}}  type="button" id="hideInfo2" value="cancel" onClick={this.showCompBox}/>
                                </div>
                            </div>
                            <div  id="inflqueryBox" className={this.state.showLQueryBox ? 'project-infobox':'project-infobox infoDiv'}> 
                            </div>
                       </div> 
                        );
                    }
                }}
            </MediaQuery>
        );
    }
}

function mapStateToProps({layers, userComplaint, activelayerdata}){
    return{layers, userComplaint, activelayerdata}
}

export default connect(mapStateToProps, {create_layer, rename_layer, get_layers, addUserComplaint, makelayerafterimport, makeLayerActive})(ProjectView);