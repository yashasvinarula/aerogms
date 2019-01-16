import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { Image, DropdownButton, MenuItem, Modal, Button, Table } from 'react-bootstrap/lib';
import LayerVisible from '../../images/LayerVisible.png';
import LayerInvisible from '../../images/LayerInvisible.png';
// import MenuIcon from '../../images/Menu.png';
import InfoIcon from '../../images/InfoIcon.png';
import AddAttribute from '../../images/add-attribute.png';
import MediaQuery from 'react-responsive';
import '../../css/layer.css';
import axios from 'axios';
import Feature from './featureInfo';
import TextIcon from '../../images/TextIcon.png';
import NumberIcon from '../../images/NumberIcon.png';
import Download_Loader from '../../images/download_loader.gif';
import {connect} from 'react-redux';
import {delete_layer, updateLayerActive, updateLayerColor} from '../../actions';
import _ from 'lodash';
import {BASE_URL} from '../../config';

const MenuImage = ( <Image src={InfoIcon} className="menu-icon inline-display margin-outside" />);
const MenuIcon = ( <Image src={InfoIcon} className="attr-menu-icon" />);

class Layer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layerVisibleState : true,
            changelayername:false,
            colorPicker : false,
            showAttributes : false,
            attributeType : '',
            attributeName : '',
            tempAttr : '',
            isActive:false,
            attributes : [{type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}],
            showAttrForm : false,
            renameAttribute : false,
            selectedColor : '0000ff',
            downloadShape : false,
        }
        this.makeLayerVisible = this.makeLayerVisible.bind(this);
        this.makeLayerInVisible = this.makeLayerInVisible.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
        this.removeColorPicker = this.removeColorPicker.bind(this);
        this.closeChangeLayerModal = this.closeChangeLayerModal.bind(this);
        this.changeLayerName = this.changeLayerName.bind(this);
        this.closeAttrModal = this.closeAttrModal.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteAttr = this.deleteAttr.bind(this);
        this.renameAttr = this.renameAttr.bind(this);
        this.deleteLayer = this.deleteLayer.bind(this);
        this.getLayerSchema = this.getLayerSchema.bind(this);
        this.servicecaller = this.servicecaller.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.downloadExcel = this.downloadExcel.bind(this);
        this.downloadGeoJson = this.downloadGeoJson.bind(this);
        this.choosenLayerActive = this.choosenLayerActive.bind(this);
        this.downloadShapefile = this.downloadShapefile.bind(this);
    };

    downloadShapefile() {
        debugger;
        this.setState({downloadShape : true});
        axios.get(`${BASE_URL}/downloadShapeFile?layer_name=${this.props.layer.orig_name}`, {responseType : 'arraybuffer'}).then((result) => {
            // axios.post(`${BASE_URL}/downloadShapeFile`, {layer_name : this.props.layer.orig_name}).then((result) => {
            debugger
            console.log(result);
            const url = window.URL.createObjectURL(new Blob([result.data]), {type : 'arrayBuffer'});
            this.setState({downloadShape : false});
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${this.props.layer.orig_name}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }).catch((err) => {
            alert(err);
        });
    }
    choosenLayerActive() {
        debugger;
        if(this.props.chosedlayer == this.props.layer.orig_name) {
            if(this.props.chosedlayer !== this.props.active_layer)
                document.getElementById(`${this.props.layer.lay_id}`).click();
            // let attrKeyList = this.state.attributes;
            // this.getLayerSchema();
            // this.props.getAttrKeyList(attrKeyList)
            this.props.getLayerAttributes();
            this.props.removeChoosedLayer();
        }
    }
    downloadGeoJson() {
        debugger;
        let layer_name = this.props.layer.orig_name;
        axios.post(`${BASE_URL}/downloadgeojson`, {layer_name : layer_name })
        .then(response=>{
            debugger;
            console.log(response.data);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:none";
            var jsondata = JSON.stringify(response.data),
                blob = new Blob([jsondata], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "geojson.json";
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err=>{
            alert(err);
        });
    }
    downloadExcel() {
        
        debugger;
        let layer_name = this.props.layer.orig_name;
        axios.post(`${BASE_URL}/downloadExcel`, {layer_name : layer_name })
        .then(response=>{
            // debugger;
            // let file = response.data.filename;
            // window.location.href = `http://localhost:4001/${file}`
            debugger;
            let file = response.data.filename;
            console.log(response)
            // window.location = `/${file}`;
            // window.open('/download_excel', '_self');
            var link = document.createElement('a');
            link.href = `/${file}`;
            link.download = `${file}`;
            link.click();
        })
        .catch(err=>{
            alert(err);
        });
    }
    handleColorChange = (color) => {
        if(this.props.layer.lay_id)
        {
            if(window.confirm('Do you really want to change the color!'))
            {
                this.setState({ selectedColor: color.hex.replace('#',''), colorPicker:false});
                this.props.updateLayerColor(this.props.layer.lay_id, color.hex.replace('#',''));
            }
            else{
                this.setState({colorPicker:false});
            }
        }
        else
        {
            alert('First save layer then change its color!');
            this.setState({colorPicker:false});
        }
    }
    showColorPicker() {
        this.setState({ colorPicker : true });
    }
    removeColorPicker() {
        this.setState({ colorPicker : false});
    }
    makeLayerVisible() {
        this.setState({ layerVisibleState : true });
        window.addWMSLayer(this.props.layer.orig_name, this.props.layer.color);

    }
    makeLayerInVisible() {
        this.setState({ layerVisibleState : false });
        window.hideWMSLayer(this.props.layer.orig_name);
    } 

    closeChangeLayerModal(){
        this.setState({changelayername:false});
    }

    changeLayerName(){
        let newLayerTitle = document.getElementById('changeLayerName').value;
        axios.post(`${BASE_URL}/lay_name_exists`, {
            lay_name: newLayerTitle
        })
        .then(responce=>{
            if(responce.data.status === 'not exists'){
                this.props.changeLayerNameParent(newLayerTitle);
                this.closeChangeLayerModal();
            }
            else{   
                if(responce.data.status === 'unauthorised')
                {
                    responce.data.message?alert(responce.data.message):'';
                    this.props.doLogout();
                }
                else{
                    alert('layer name is already exists! Please try with another name.')
                }
            }
        })
        .catch(err=>{
            console.log('error: ' + err)
        })
    }
    closeAttrModal() {
        this.setState({showAttributes : false, showAttrForm: false});
    }
    handleChange(event) {
        this.setState({attributeName : event.target.value});
    }
    handleRadioChange(event) {
        this.setState({attributeType : event.target.value});
    }
    componentDidMount(){
        if(this.props.layer.lay_id){
            window.addWMSLayer(this.props.layer.orig_name, this.props.layer.color);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.layer.lay_id !== this.props.layer.lay_id) {
            if(this.props.layer.lay_id)
            {
                window.addWMSLayer(this.props.layer.orig_name, this.props.layer.color);
                window.createNewLayer(this.props.layer.type);
                this.props.updateLayerActive({new_activeLayer_id:this.props.layer.lay_id});
            }
        }
        else if(prevProps.layer.color !== this.props.layer.color){
                window.addWMSLayer(this.props.layer.orig_name, this.props.layer.color);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let that = this;
        let newAttribute = {name: '', type: ''};
        newAttribute.name = this.state.attributeName;
        newAttribute.type = this.state.attributeType;
        if(this.state.attributeName ==='' || this.state.attributeType === ''){
            alert('Please fill all fields');
        }
        else {
            if(isNaN(parseInt(this.state.attributeName.substr(0,1))) && this.state.attributeName.length > 0 && this.state.attributeName.indexOf(' ') == -1 && this.state.attributeName.indexOf('-') == -1){
                let flag = 0;
            event.target.reset();
            this.state.attributes.map((attr) => {
                if(attr.name === this.state.attributeName) {
                    flag = 1;
                    this.setState({attributeName:''});
                    return(alert('Attribute with this name already exists.'));
                }
            });

            if( flag === 0) {
                this.servicecaller('add_column', {layer:this.props.layer.orig_name, column:newAttribute.name, type:newAttribute.type}, function(err, data){
                    if(!err && data){
                        newAttribute.type = newAttribute.type === 'number'? 'numeric': 'character varying';
                        that.setState({attributes : [...that.state.attributes, newAttribute], 
                            showAttrForm : false, attributeName : '', attributeType : ''});
                    }
                    else
                    {
                        if(err.status === 'unauthorised')
                        {
                            err.message ? alert(err.message):'';
                            that.props.doLogout();
                        }
                        else{
                            err.message ? alert(err.message):'';
                        }
                    }
                });
            }
            }
            else{
                alert('Attribute name doesn\'t have any space, hyphen and numbers in the starting!');
            } 
        }
    }
    deleteAttr(event) {
        let attrArray = [...this.state.attributes];
        let attrIndex = attrArray.findIndex(attribute => attribute.name === event.target.name );
        var that = this;
        if(attrIndex !== -1) {
            //attrArray.splice(attrIndex, 1);
            if(window.confirm('Do you really want to delete this attribute?'))
            {
                this.servicecaller('delete_column', {layer:this.props.layer.orig_name, column:event.target.name}, function(err, data){
                    if(!err && data){
                        attrArray.splice(attrIndex, 1);
                        that.setState({attributes : attrArray})
                    }
                    else
                    {
                        if(err.status === 'unauthorised')
                        {
                            err.message ? alert(err.message):'';
                            that.props.doLogout();
                        }
                        else{
                            err.message ? alert(err.message):'';
                        }
                    }
                });
            }
        }
    }
    renameAttr(event) {
        event.preventDefault();
        let newName = isNaN(parseInt(this.state.attributeName.substr(0,1))) && this.state.attributeName.length > 0 && this.state.attributeName.indexOf(' ') == -1 && this.state.attributeName.indexOf('-') == -1 ? this.state.attributeName.trim().toLowerCase():'';
        if(newName)
        {
            var that = this;
            let tempAttribute = this.state.tempAttr;
            let attrArray = [...this.state.attributes];
            let attrIndex = attrArray.findIndex(attribute => attribute.name === tempAttribute );
            if(attrIndex !== -1 && attrIndex !== 'undefined') {
                    this.servicecaller('rename_column', {layer:this.props.layer.orig_name, old_column:tempAttribute, new_column:newName}, function(err, data){
                        if(!err && data){
                            attrArray[attrIndex].name = newName;
                            that.setState({ attributes : attrArray, renameAttribute : false, attributeName : '', tempAttr : '' });
                        }
                        else
                        {
                            if(err.status === 'unauthorised')
                        {
                            err.message ? alert(err.message):'';
                            that.props.doLogout();
                        }
                        else{
                            err.message ? alert(err.message):'';
                        }
                        }
                    });
            }
        }
        else
        {
            alert('Attribute name doesn\'t have any space, hyphen and numbers in the starting!');
        }
    }
    deleteLayer(){
        if(window.confirm(`Do you really want to delete ${this.props.layer.name} layer.`)){
            if(this.props.layer.orig_name && this.props.layer.lay_id)
            {
                this.props.delete_layer(this.props.layer.orig_name, this.props.layer.lay_id);
                window.hideWMSLayer(this.props.layer.orig_name);
                window.lyrhighlighter ? window.m.removeLayer(window.lyrhighlighter):false;
            }
            else
            {
                this.props.deleteTempLayer(this.props.layer.name);
                var element = document.getElementById(this.props.layer.name);
                element.parentNode.removeChild(element);
            }
        }
    }
    setActiveLayer(){
        debugger;
        let that = this;
        if(this.props.layer.lay_id){
            this.servicecaller('get_bound', {layer:this.props.layer.orig_name}, function(err, data){
                if(!err && data){
                    let box = data.box;
                    let style='';
                    switch(that.props.layer.type)
                    {
                        case 'Point':
                            style = 'point_hl';
                            break;
                        case 'Linestring':
                            style = 'line_hl';
                            break;
                        case 'LineString':
                            style = 'line_hl';
                            break;
                        case 'Polygon':
                            style = 'polygon_hl';
                            break;
                    }
                    window.updateWMSStyle(that.props.layer.orig_name, style);
                    that.props.setActiveLayer(box);
                    that.setState({isActive:true});
                }
                else{
                    if(err.status === 'unauthorised')
                    {
                        err.message ? alert(err.message):'';
                        that.props.doLogout();
                    }
                    else{
                        err.message ? alert(err.message):'';
                    }
                }
            })
        }
        else{
            that.props.setActiveLayer('');
            that.setState({isActive:true});
        }
       
    }
    resetActiveLayer(){
        debugger;
        let style='';
        switch(this.props.layer.type)
        {
            case 'Point':
                style = 'point';
                break;
            case 'Linestring':
                style = 'line';
                break;
            case 'LineString':
                style = 'line';
                break;
            case 'Polygon':
                style = 'polygon';
                break;
        }
        window.updateWMSStyle(this.props.layer.orig_name, style);
        this.props.resetActiveLayer();
        this.setState({isActive:false});
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
            if(err.response)
            {
                callback(err.response.data, undefined);
            }
            else{
                err.message?alert(err.message):'';
            }
        })
    }

    getLayerSchema(){
        debugger;
        let layerName= this.props.layer.orig_name;
        var that = this;
       if(layerName)
       {
        this.servicecaller('layer_attribute', {layer:this.props.layer.orig_name}, function(err, data){
            if(!err && data){
                that.setState({attributes:data.data, showAttributes:true, renameAttribute:false});
            }
            else
            {
                if(err.status === 'unauthorised')
                {
                    err.message ? alert(err.message):'';
                    that.props.doLogout();
                }
                else{
                    err.message ? alert(err.message):'';
                }
            }
        });
       }
    }

    render() {
        return (
            <MediaQuery maxWidth={768}>
            {(matches) => {
                if(matches) {
                    return (
                        <div>
                        <div className="layer"> 
                            {/* {
                                this.props.layersInfo 
                                ? (<input type="radio" name="group1" className="input-layer col-xs-2" />) 
                                : ''
                            } */}
                            {
                                this.props.layersInfo
                                ? (<span onClick={this.showColorPicker} className="color-rectangle on-hover inline-display"></span>)
                                : ''
                            }
                            <div className="inline-display layer-title-box">
                                <h4 className="layer-title on-hover margin-outside" onClick={()=>this.setState({changelayername:true})}> {this.props.layer.name}</h4>
                                <Modal className="modal-custom"
                                    show={this.state.changelayername}
                                    onHide={this.closeChangeLayerModal}
                                    container={this}>
                                    <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                    <Modal.Body>
                                        {/* <label htmlFor="layerTitle">Enter Name</label> */}
                                        <input type="text" id="changeLayerName" placeholder="Enter Name" />
                                        <Button onClick={this.changeLayerName}>Update</Button>
                                    </Modal.Body>
                                </Modal>
                                <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6>
                            </div>
                           
                            {
                                !this.props.layersInfo
                                ?
                                    (this.state.layerVisibleState 
                                    ? <Image src={LayerVisible} onClick={this.makeLayerInVisible} className="visibility-icon on-hover inline-display" />
                                    : <Image src={LayerInvisible} onClick={this.makeLayerVisible} className="visibility-icon on-hover inline-display" />)
                                :
                                    (<DropdownButton
                                        title={MenuImage}
                                        noCaret
                                        pullRight
                                      >
                                      <style type="text/css">{`
                                        .btn-group {
                                            position: absolute;
                                            right: 10px;
                                            vertical-align: middle;
                                        }
                                      `}</style>
                                        <MenuItem>Download</MenuItem>
                                        <MenuItem onClick={() => this.setState({showAttributes : true})}>Attributes</MenuItem>
                                            <Modal
                                                show={this.state.showAttributes}
                                                onHide={this.closeAttrModal}
                                                container={this}
                                            >
                                                <Modal.Header closeButton>Layer Title</Modal.Header>
                                                <Modal.Body>
                                               
                                                    {   !this.state.showAttrForm ?
                                                           (
                                                            <div>
                                                            {
                                                                (this.state.attributes.length > 0) ? 
                                                                    !this.state.renameAttribute ? 
                                                                    (<div>
                                                                        <h5>Attributes List</h5>
                                                                        <Table className="attr-list" striped>
                                                                            <thead className="attr-thead">
                                                                                <tr>
                                                                                    <th>Type</th>
                                                                                    <th>Name</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <style type="text/css">{`
                                                                                    .modal-body {
                                                                                        max-height: 500px;
                                                                                        overflow: auto;
                                                                                    }
                                                                                `}</style>
                                                                                {
                                                                                    this.state.attributes.map((attr, index) => {
                                                                                        let typeIcon;
                                                                                        switch(attr.type) {
                                                                                            case 'text':
                                                                                                typeIcon = TextIcon;
                                                                                                break;
                                                                                            case 'number':
                                                                                                typeIcon = NumberIcon;
                                                                                                break;
                                                                                            default:
                                                                                                break;        
                                                                                        }
                                                                                        return (<tr className="attr-list-item">
                                                                                                    <td><Image src={typeIcon} className="attr-type-icon" /></td>
                                                                                                    <td>{attr.name}</td>
                                                                                                    <td>
                                                                                                        <DropdownButton
                                                                                                            title={MenuIcon}
                                                                                                            noCaret pullRight
                                                                                                        >
                                                                                                            <MenuItem onClick={() => this.setState({renameAttribute : true, tempAttr : attr.name})}>Rename</MenuItem>
                                                                                                            <MenuItem onClick={this.deleteAttr} name={attr.name}>Delete</MenuItem>
                                                                                                        </DropdownButton>
                                                                                                    </td>
                                                                                                </tr>);
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </Table>
                                                                        <Button className="add-attr" onClick={() => this.setState({showAttrForm : true})} >Add Attribute</Button>
                                                                    </div>)
                                                                :   
                                                                (
                                                                    <form>
                                                                        <label>Name
                                                                            <input type="text" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                                        </label>
                                                                        <Button type="submit" onClick={this.renameAttr} className="custom-button">Rename</Button>
                                                                    </form>
                                                                )
                                                                : ''
                                                            }
                                                        </div>
                                                        )
                                                        : 
                                                            (<form onSubmit={this.handleSubmit.bind(this)}>
                                                                <label>Name
                                                                <input type="text" id="attr-title" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                                </label>
                                                                <label>Type</label>
                                                                <ul>
                                                                    <li>
                                                                        <label>
                                                                            <input className="radio-input" 
                                                                            type="radio" value="text"
                                                                            onChange={this.handleRadioChange} 
                                                                            checked={this.state.attributeType === "text"} />Text
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            <input className="radio-input" 
                                                                            type="radio" value="number"
                                                                            onChange={this.handleRadioChange} 
                                                                            checked={this.state.attributeType === "number"} />Numeric
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                                <Button type="submit" className="custom-button">Add</Button>
                                                            </form>)
                                                    }
                                                </Modal.Body>
                                            </Modal>
                                        <MenuItem>Table</MenuItem>    
                                        <MenuItem>Delete</MenuItem>
                                    </DropdownButton>)
                            }
                            
                            {
                                this.state.colorPicker ? (<CompactPicker />) : null
                            }
                        </div>
                        <hr className="layer-separator" />
                    {/* <Feature /> */}
                </div>
                    );
                } else {
                    return (
                        <div id={this.props.layer.orig_name? this.props.layer.orig_name:this.props.layer.name}>
                        <div className="layer">
                            {/* <input type="radio" name="group1" className="input-layer col-xs-2" /> */}
                            {
                                this.state.layerVisibleState 
                                    ? <Image src={LayerVisible} onClick={this.makeLayerInVisible} className="visibility-icon on-hover inline-display margin-outside" />
                                    : <Image src={LayerInvisible} onClick={this.makeLayerVisible} className="visibility-icon on-hover inline-display margin-outside" />
                            }
                            <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display " style={{backgroundColor:`#${this.props.layer.color}`}}></div>
                            <div id={this.props.layer.lay_id}  className="inline-display layer-title-box" onClick={()=>{this.state.isActive? this.resetActiveLayer():this.setActiveLayer()}}>
                                {/* <input id={this.props.layer.lay_id} type="hidden"/> */}
                                <h4 className="layer-title on-hover margin-outside"> {this.props.layer.name}</h4>
                                <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6>
                            </div>
                            {
                                this.state.downloadShape ?
                                    <Image src={Download_Loader} className="download-loader" />
                                : ''
                            }
                          {/* <Button id="zoomBtn" onClick={}>Zoom</Button> */}
                            {
                                this.props.chosedlayer ?
                                    this.choosenLayerActive()
                                : ''
                            }
                            <DropdownButton
                                title={MenuImage}
                                noCaret
                                pullRight
                              >
                              <style type="text/css">{`
                              .btn-group {
                                  position: absolute;
                                  right: 5px;
                                  vertical-align: middle;
                              }
                            `}</style>
                                <MenuItem onClick={()=>this.setState({changelayername:true})}>Rename</MenuItem>
                                <Modal className="modal-custom"
                                        show={this.state.changelayername}
                                        onHide={this.closeChangeLayerModal}
                                        container={this}>
                                        <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                        <Modal.Body>
                                            <input type="text" id="changeLayerName" placeholder="Enter Name"/>
                                            <Button onClick={this.changeLayerName}>Update</Button>
                                        </Modal.Body>
                                </Modal>
                                <MenuItem onClick={() => this.getLayerSchema()}>Attributes</MenuItem>
                                    <Modal
                                        show={this.state.showAttributes}
                                        onHide={this.closeAttrModal}
                                        container={this}
                                    >
                                        <Modal.Header closeButton>{this.props.layer.name}</Modal.Header>
                                        <Modal.Body>
                                            {
                                                !this.state.showAttrForm ? 
                                                    (
                                                        <div>
                                                            {
                                                                (this.state.attributes.length > 0) ? 
                                                                    !this.state.renameAttribute ? 
                                                                    (<div>
                                                                        <h5>Attributes List</h5>
                                                                        <Table className="attr-list" striped>
                                                                            <thead className="attr-thead">
                                                                                <tr>
                                                                                    <th>Type</th>
                                                                                    <th>Name</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <style type="text/css">{`
                                                                                    .modal-body {
                                                                                        max-height: 500px;
                                                                                        overflow: auto;
                                                                                    }
                                                                                `}</style>
                                                                                {
                                                                                    this.state.attributes.map((attr, index) => {
                                                                                        let typeIcon;
                                                                                        switch(attr.type) {
                                                                                            case 'character varying':
                                                                                                typeIcon = TextIcon;
                                                                                                break;
                                                                                            case 'integer':
                                                                                                typeIcon = NumberIcon;
                                                                                                break;
                                                                                            case 'numeric':
                                                                                                typeIcon = NumberIcon;
                                                                                                break;
                                                                                            default:
                                                                                                break;        
                                                                                        }
                                                                                        return (<tr className="attr-list-item">
                                                                                                    <td><Image src={typeIcon} className="attr-type-icon" /></td>
                                                                                                    <td>{attr.name}</td>
                                                                                                  <td>
                                                                                                  {attr.name !== 'aero_id' ? <DropdownButton
                                                                                                            title={MenuIcon}
                                                                                                            noCaret pullRight
                                                                                                        >
                                                                                                            <MenuItem onClick={() => this.setState({renameAttribute : true, tempAttr : attr.name})}>Rename</MenuItem>
                                                                                                            <MenuItem onClick={this.deleteAttr} name={attr.name}>Delete</MenuItem>
                                                                                                        </DropdownButton>:''}
                                                                                                    </td>
                                                                                                </tr>);
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </Table>
                                                                        <Button className="add-attr" onClick={() => this.setState({showAttrForm : true})} >Add Attribute</Button>
                                                                    </div>)
                                                                :   
                                                                (
                                                                    <form>
                                                                        <label>Name
                                                                            <input type="text" onChange={this.handleChange} placeholder={this.state.tempAttr} />
                                                                        </label>
                                                                        <Button type="submit" onClick={this.renameAttr} className="custom-button">Rename</Button>
                                                                    </form>
                                                                )
                                                                : ''
                                                            }
                                                        </div>
                                                    )
                                                :   
                                                    (<form onSubmit={this.handleSubmit}>
                                                        <label>Name
                                                            <input type="text" id="attr-title" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                        </label>
                                                        <label>Type</label>
                                                        <ul>
                                                            <li>
                                                                <label>
                                                                    <input className="radio-input"
                                                                    type="radio" value="text"
                                                                    onChange={this.handleRadioChange} 
                                                                    checked={this.state.attributeType === "text"} />Text
                                                                </label>
                                                            </li>
                                                            <li>
                                                                <label>
                                                                    <input className="radio-input" 
                                                                    type="radio" value="number"
                                                                    onChange={this.handleRadioChange} 
                                                                    checked={this.state.attributeType === "number"} />Numeric
                                                                </label>
                                                            </li>
                                                        </ul>
                                                        <Button type="submit" className="custom-button">Add</Button>
                                                    </form>)
                                            }
                                        </Modal.Body>
                                    </Modal>
                                <MenuItem onClick={()=>this.deleteLayer()}>Delete</MenuItem>
                                <MenuItem onClick={() => this.downloadExcel() }>Download Excel</MenuItem>
                                <MenuItem onClick={() => this.downloadGeoJson() }>Download GeoJson</MenuItem>
                                <MenuItem onClick={() => this.downloadShapefile() }>Download Shape File</MenuItem>
                            </DropdownButton>
                            {
                                this.state.colorPicker ? (<CompactPicker  color={ this.state.selectedColor }
                                    onChangeComplete={ this.handleColorChange }/>) : null
                            }
                        </div>
                        <hr className="layer-separator" />
                    {/* <Feature /> */}
                </div>
                    );
                }
            }}
            </MediaQuery>
        );
    }
}

export default connect(null, {delete_layer, updateLayerActive, updateLayerColor})(Layer);