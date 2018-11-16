import React, {Component} from 'react';
import { Navbar, NavItem, Image, DropdownButton, MenuItem, Modal, Button, Table } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import MediaQuery from 'react-responsive';
import Layer from './layer';
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
import {create_layer, rename_layer, get_layers, addUserComplaint} from '../../actions'
import _ from 'lodash';
import axios from 'axios';

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
            compBoxShow:false,
            compboxvalue:'',
            queryTable : false,
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
        this.showCompBox = this.showCompBox.bind(this);
        this.submitComplaint = this.submitComplaint.bind(this);
        this.getCompBoxValue = this.getCompBoxValue.bind(this);
        this.closeInfoDiv = this.closeInfoDiv.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.closePaymentModal = this.closePaymentModal.bind(this);
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
    closePaymentModal(){
        this.setState({showPaymentModal:false});
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
        this.setState({compBoxShow:false});

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
                debugger
                console.log(complaint);
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

    render(){
        // if(this.props.userComplaint){
        //     console.log('coming from complaint reducer');
        //     console.log(this.props.userComplaint);
        // }

        let drawerStates={};
        drawerStates.slider = this.state.slider;
        drawerStates.more = this.state.more;
        drawerStates.sliderPartial = this.state.sliderPartial;
        drawerStates.close = this.state.close;
        console.log(this.state.layers);
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
                            <div>
                                <Navbar>
                                <NavItem className="nav-items"><input type="button" id="btnMakePoint" value="AddPoint" onClick={this.addPoint}/></NavItem>
                                <NavItem className="nav-items"><input type="button" id="btnMakeLine" value="AddLine" onClick={this.addLine}/></NavItem>
                                <NavItem className="nav-items"><input type="button" id="btnMakePolygon" value="AddPolygon" onClick={this.addPolygon}/></NavItem>
                                <NavItem className="nav-items"><input type="button" id="saveLayer" value="Save Layer" onClick={this.saveLayer}/></NavItem>
                                <NavItem className="nav-items"><input style={{visibility:"hidden"}}  type="button" id="removeFeature" 
                                    value="Remove Feature" onClick={this.removeFeature}/></NavItem>
                                    <NavItem className="nav-items"><input className="tempButnWid" type="button" value="Complaint Dashboard" onClick={()=>{this.setState({queryTable : true})}}/></NavItem>
                                </Navbar>
                                {
                                    this.state.queryTable ?
                                    (
                                    <div className="table-div" >    
                                        
                                        <div className="query-table-div" id="divCompTable">
                                        <Image onClick={() => this.setState({queryTable : false})} src={CrossIcon} className="table-cross-icon" />
                                            <Table striped className="query-table">
                                                <caption className="text-center" style={{fontWeight : 700}}>
                                                    My Dashboard
                                                </caption>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">AeroId</th>
                                                        <th className="text-center">Comp.Id</th>
                                                        <th className="text-center">Description</th>
                                                        <th className="text-center">Date</th>
                                                        <th className="text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.getTableData()}
                                                </tbody>
                                              
                                            </Table>
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
                                    <Modal className="modal-custom"

                                        show={this.state.showImportModal}
                                        onHide={this.closeImportModal}
                                        container={this}
                                    >
                                        <Modal.Header closeButton>Choose a file to import</Modal.Header>
                                        <Modal.Body>
                                        
                                            {/* <Button onClick={(e) => this.myInput.click() }>Select a file from your computer</Button>
                                            <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} /> */}
                                        <form id="frmUploader" enctype="multipart/form-data" action="/api/fileupload" method="post">
                                        <input type="file" name="fileupload" multiple/>
                                        <input type="submit" name="submit" id="btnSubmit" value="Upload" />
                                        </form>
                                            <div id="divloader" className="loader">
                                                <img src="./images/loader.gif" alt="loader" className="loaderImg"/>
                                            </div>
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
                                <span className="info-header"><b>Info Panel</b></span>
                                <hr/>
                                <div id="infoText">
                                </div>
                                <br/>
                                <input id="btnAddComp" type="Button" value="Add Complaint" onClick={this.showCompBox}></input>
                                <input style={{marginLeft:5, marginTop:10, visibility:"true"}}  type="button" id="hideInfo" value="Payment" onClick={()=>{this.setState({showPaymentModal:true})}}/>
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

                                <br/><hr/>
                                <div id="divCompBox" className={this.state.compBoxShow? '':'comp-box-div'}>
                                    <div>
                                        <textarea id="taCompDesc" onChange={this.getCompBoxValue} type="text" value={this.state.compboxvalue} className="text-area"></textarea>
                                    </div>
                                    <input type="Button" value="submit" onClick={this.submitComplaint}></input>
                                    <input style={{marginLeft:5, marginTop:10, visibility:"true"}}  type="button" id="hideInfo2" value="cancel" onClick={this.closeInfoDiv}/>
                                </div>
                            </div>
                        </div>
                        
                        );
                    }
                }}
            </MediaQuery>
        );
    }
}

function mapStateToProps({layers, userComplaint}){
    return{layers, userComplaint}
}

export default connect(mapStateToProps, {create_layer, rename_layer, get_layers, addUserComplaint})(ProjectView);