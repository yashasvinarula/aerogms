import React, {Component} from 'react';
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
import importLayer from '../../images/ImportLayerPNG.png';
import {create_layer, rename_layer, get_layers} from '../../actions'
import _ from 'lodash';
import axios from 'axios';
import SpecificQuery from './specificQuery';

const queryList = [
    {
        aero_id : 1234,
        query_id : 1234,
        date : '21 May, 2018',
        subject : 'First complaint',
        status : 'Pending',
        description : 'First complaint in query list'
    },
    {
        aero_id : 4567,
        query_id : 4567,
        date : '21 September, 2018',
        subject : 'Second complaint',
        status : 'Resolved',
        description : 'Second complaint in query list'
    },
    {
        aero_id : 6789,
        query_id : 6789,
        date : '21 August, 2018',
        subject : 'Third complaint',
        status : 'Considered',
        description : 'Third complaint in query list'
    }
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
            layerType : '',
            layer : {visible : '', name : '', type : '', color : '', strokeColor : ''},
            layers : [],
            remFeature : false,
            layerList : false,
            analytics : false,
            validation : false,
            info : true,
            showVisibles : false,
            showFeatures : false,
            activeLayer : null,
            queryTable : false,
            editReq : false,
            queryForm : false,
            queryType : '',
            tabKey : 1, // for list of complaints and specific complaint
            queryList : queryList, // list of all types queries
            currentQueryIndex : 0, //index for current query row selected by default for 1st query row
            showSpecificQuery : true, // for showing specific query by default true for showing first query
            enableNext : 'prev-next-btn', // to enable css class on next button
            enablePrev : 'disable-btn', // to enable css class on previous button
        }
        
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeAddLayerModal = this.closeAddLayerModal.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
        this.saveLayer = this.saveLayer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.openFullDrawer = this.openFullDrawer.bind(this);
        this.openPartialDrawer = this.openPartialDrawer.bind(this);
        this.makeLayerActive = this.makeLayerActive.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.showNextQuery = this.showNextQuery.bind(this);
        this.showPreviousQuery = this.showPreviousQuery.bind(this);
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
    makeLayerActive() {
        
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
    componentWillMount () {
        let pid = window.initMap();
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
    addLayer() {
        // debugger
        let newLayerTitle = document.getElementById('layer-title').value;
        if(newLayerTitle !== ''){
            // axios.post('/api/lay_name_exists', {
            //     lay_name: newLayerTitle
            // })
            // .then(responce=>{
            //     debugger
            //     console.log(responce);
            //     if(responce.data.status === 'not exists'){
                    let newLayer={}; //= this.state.layer;
                    newLayer.visible = true;
                    newLayer.name = newLayerTitle;
                    newLayer.type = this.state.layerType;
                    //newLayer.backgroundColor = '4D4D4D';
                    //newLayer.outline = 'B3B3B3';
        
                    this.setState({ layer : newLayer });
                    //let newLayers = this.state.layers;
                    //newLayers.push(newLayer);
                    //this.setState({ ...this.statelayers, newLayer });
                    //{"point113":{"name":"point113","type":"Point","visible":true}}
        
                    this.props.layers[newLayerTitle] = newLayer;
                    this.closeAddLayerModal();
                    this.createNewLayer(this.state.layerType);
                }
                else{
                    alert('layer name is already exists! Please try with another name.')
                }
            // })
            // .catch(err=>{
            //     console.log('error: ' + err)
            // })
        // }
        // else{
        //     alert('Please enter layer name/title!');
        // }
    }
    renderLayers() {
        // if(this.state.layers.length !== 0) {
        //     return this.state.layers.map((layer) => {
        //        return (<li><Layer key={layer.name} layer={layer} changeLayerNameParent={(name)=>{layer.name = name}}/></li>);
        //     });
        // }
        // debugger
        if(Object.keys(this.props.layers).length>0){
            return _.map(this.props.layers, layer=>{
                console.log(layer);
                return (<li><Layer key={layer.lay_id} layer={layer} changeLayerNameParent={(name)=>{this.props.rename_layer(layer.lay_id, name)}}/></li>);
            })
        }
    }
    createNewLayer(type){
        window.createNewLayer(type);
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
        latlngArray =  window.saveLayer(this.state.layer.type, this.state.layer.name);
        debugger
        if(latlngArray !== null && latlngArray !== undefined){
            if(latlngArray.latlngs.length > 0)
            {
                delete this.props.layers[this.state.layer.name];
                console.log('in react return ');
                console.log(latlngArray.latlngs);
                this.props.create_layer(latlngArray.layer_name, latlngArray.type, latlngArray.pro_id, this.props.userDetails.email, latlngArray.latlngs);
            }
        }
    }
    closeInfoDiv(){
        window.closeInfoDiv();
    }
    removeFeature(){
        window.removeSelFeature();
    }
    render(){
        // debugger;
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
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Point' })}>Point</MenuItem>
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Line' })}>Line</MenuItem>
                                                <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Polygon' })}>Polygon</MenuItem>
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
                            <   div>
                                <Navbar fixedTop>
                                    <NavItem className="nav-items"><input type="button" id="btnMakePoint" value="AddPoint" onClick={this.addPoint}/></NavItem>
                                    <NavItem className="nav-items"><input type="button" id="btnMakeLine" value="AddLine" onClick={this.addLine}/></NavItem>
                                    <NavItem className="nav-items"><input type="button" id="btnMakePolygon" value="AddPolygon" onClick={this.addPolygon}/></NavItem>
                                    <NavItem className="nav-items"><input type="button" id="saveLayer" value="Save Layer" onClick={this.saveLayer}/></NavItem>
                                    <NavItem className="nav-items"><input style={{visibility:"hidden"}}  type="button" id="removeFeature" 
                                        value="Remove Feature" onClick={this.removeFeature}/></NavItem>
                                    <NavItem className="nav-items"><input type="button" className=""
                                         value="Query Dashboard" onClick={() => this.setState({queryTable : true})} /></NavItem>
                                </Navbar>
                                {
                                    this.state.queryTable ?
                                    (
                                    <div className="table-div">    
                                        <div className="query-table-div">
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
                            <div className="">
                            </div>
                            <div className="project-layer-box">
                                <div>
                                    <h4 className="text-center">Project Title</h4>
                                </div>
                                <hr className="separator-line"></hr>
                                <div className="row">
                                    <div className="icons-display on-hover text-center col-xs-6 left-padding" onClick={() => this.setState({ showImportModal : true })}>
                                        <Image src={importLayer} className="add-import-icons " />
                                        <span className="margin-outside">Import Layer</span>
                                    </div>
                                    {/* <Modal className="modal-custom"
                                        show={this.state.showImportModal}
                                        onHide={this.closeImportModal}
                                        container={this}
                                    >
                                        <Modal.Header closeButton>Choose a file to import</Modal.Header>
                                        <Modal.Body> */}
                                            {/* <Button onClick={(e) => this.myInput.click() }>Select a file from your computer</Button>
                                            <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} /> */}
                                            {
                                                this.state.showImportModal ? 
                                                (
                                                    <div className="layer-upload">
                                                        <Image src={CrossIcon} className="cross-icon" onClick={this.closeImportModal} />
                                                        <form id="frmUploader" enctype="multipart/form-data" action="/api/fileupload" method="post">
                                                            <input className="upload-btn" type="file" name="fileupload" multiple/>
                                                            <input className="upload-btn" type="submit" name="submit" id="btnSubmit" value="Upload" />
                                                        </form>
                                                        <div id="divloader" className="loader">
                                                            <img src="./images/loader.gif" alt="loader" className="loaderImg"/>
                                                        </div>
                                                    </div>
                                                )
                                                : ''
                                            }
                                        {/* </Modal.Body>
                                    </Modal> */}
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
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Point' })}>Point</MenuItem>
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Line' })}>Line</MenuItem>
                                        <MenuItem onClick={() => this.setState({ showAddLayerModal : true, layerType : 'Polygon' })}>Polygon</MenuItem>
                                        <Modal className="modal-custom"
                                            show={this.state.showAddLayerModal}
                                            onHide={this.closeAddLayerModal}
                                            container={this}
                                        >
                                            <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                            <Modal.Body>
                                                <input type="text" id="layer-title" placeholder="Enter Name"/>
                                                <Button onClick={this.addLayer}>Save</Button>
                                            </Modal.Body>
                                        </Modal>
                                    </DropdownButton>
                                </div>
                                <hr className="separator-line"></hr>
                                <div>
                                    <ul id="group1">
                                        {this.renderLayers()}
                                    </ul>
                                </div>
                            </div>
                            <div  id="infoDiv" className="project-infobox">
                                <h3 className="text-center">Info Panel</h3>
                                <Table striped className="info-panel-attr-list scroll">
                                    <caption className="text-center">Attributes Information</caption>
                                    <thead>
                                        <tr>
                                            <th className=" text-center">Name</th>
                                            <th className=" text-center">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="text-center td-info-panel">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        {/* <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr>
                                        <tr><td className="text-center">Area</td><td className="text-center">1234</td></tr> */}
                                    </tbody>
                                </Table>
                                {
                                    !this.state.queryForm ?
                                        (
                                            <DropdownButton
                                                bsStyle="default"
                                                id="dropdown-default"
                                                title={`Interact with Admin`}
                                                className="query-list-dropdown"
                                            >
                                                <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Suggestion'})}>Suggestion</MenuItem>
                                                <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Complaint'})}>Complaint</MenuItem>
                                                <MenuItem onClick={() => this.setState({queryForm : true, queryType : 'Question'})}>Question</MenuItem>
                                                <MenuItem onClick={() => this.setState({queryForm : true, editReq : true})}>Edit Request</MenuItem>
                                            </DropdownButton>
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
                                {/* {
                                    this.state.editReq && !this.state.queryForm ? 
                                    
                                    : ''
                                } */}
                                {/* <div id="infoText">
                                </div>
                                <div>
                                    <textarea type="text" className="text-area"></textarea>
                                </div>
                                <input type="Button" value="submit"></input>
                                <input style={{marginLeft:5, marginTop:20, visibility:"true"}} 
                                 type="button" id="showInfo" value="cancel" onClick={this.closeInfoDiv}/> */}
                            </div>
                        </div>
                        );
                    }
                }}
            </MediaQuery>
        );
    }
}

function mapStateToProps({layers}){
    return{layers}
}

export default connect(mapStateToProps, {create_layer, rename_layer, get_layers})(ProjectView);