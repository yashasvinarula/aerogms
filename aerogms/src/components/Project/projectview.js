import React, {Component} from 'react';
import {  Image, DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap/lib';
import { slide as Menu } from 'react-burger-menu';
import MediaQuery from 'react-responsive';
import Layer from './layer';
import Analytics from './analytics';
import Validation from './validation';
import LayersPNG from '../../images/layers.png';
import LeftArrow from '../../images/LeftArrow.png';
import '../../css/project.css';
import addLayer from '../../images/AddLayerPNG.png';
import importLayer from '../../images/ImportLayerPNG.png';

// class AddLayer extends Component {
//     render() {
    const AddLayer = 
        (
            <div className="icons-display text-center col-xs-6">
                <Image src={addLayer} className="add-import-icons" />
                <span className="margin-outside">Add Layer</span>
            </div>
        );
//     }
// }
class ProjectView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showImportModal : false,
            showAddLayerModal : false,
            layerType : '',
            layer : {visible : '', name : '', type : '', color : '', strokeColor : ''},
            layers : [],
            remFeature:false,
            layerList : false,
            analytics : false,
            validation : false,
            info : true,
            showVisibles : false,
            // map : false,
        }
        
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeAddLayerModal = this.closeAddLayerModal.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
        this.saveLayer = this.saveLayer.bind(this);
    }

    componentWillMount () {
        window.initMap();
    }
    closeImportModal() {
        this.setState({ showImportModal : false});
    }
    closeAddLayerModal() {
        this.setState({ showAddLayerModal : false });
    }
    addLayer() {
        let newLayerTitle = document.getElementById('layer-title').value;
        if(newLayerTitle !== ''){
            let newLayer={}; //= this.state.layer;
            newLayer.visible = true;
            newLayer.name = newLayerTitle;
            newLayer.type = this.state.layerType;
            newLayer.backgroundColor = '4D4D4D';
            newLayer.outline = 'B3B3B3';

            this.setState({ layer : newLayer });
            let newLayers = this.state.layers;
            newLayers.push(newLayer);
            this.setState({ ...this.statelayers, newLayer });
            this.closeAddLayerModal();
            this.createNewLayer(this.state.layerType);
           
        }
        else{
            alert('Please enter layer name/title!');
        }
    }

    renderLayers() {
        if(this.state.layers.length !== 0) {
            return this.state.layers.map((layer) => {
               return (<li><Layer key={layer.name} layer={layer} changeLayerNameParent={(name)=>{layer.name = name}}/></li>);
            });
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
        console.log('in react return ');
        console.log(latlngArray.latlngs);
    }

    removeFeature(){
        window.removeSelFeature();
    }

    render(){
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
                                            {/* <ul>
                                                {this.renderLayers()}
                                            </ul> */}
                                            <ul id="group1" className="">
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                                <li><Layer className="input-layer" layersInfo={this.state.info} /></li>
                                            </ul>
                                        </div>
                                        <div className="bottom-layers-panel">
                                            <ul className="row">
                                                <li className="col-xs-6" onClick={() => this.setState({info : true})} >Info</li>
                                                <li className="col-xs-6" onClick={() => this.setState({info : false})} >Visibility</li>
                                            </ul>
                                        </div>
                                    </div>)
                                    : ''
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
                            <div className="">
                                <input style={{marginTop:20}} type="button" id="btnMakePoint" value="AddPoint" onClick={this.addPoint}/>
                                <input style={{marginLeft:5, marginTop:20}} type="button" id="btnMakeLine" value="AddLine" onClick={this.addLine}/>
                                <input style={{marginLeft:5, marginTop:20}} type="button" id="btnMakePolygon" value="AddPolygon" onClick={this.addPolygon}/>
                                <input style={{marginLeft:5, marginTop:20}} type="button" id="saveLayer" value="Save Layer" onClick={this.saveLayer}/>
                                <input style={{marginLeft:5, marginTop:20, visibility:"hidden"}}  type="button" id="removeFeature" value="Remove Feature" onClick={this.removeFeature}/>
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
                                        </Modal.Body>
                                            {/* <Button onClick={(e) => this.myInput.click() }>Select a file from your computer</Button>
                                            <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} /> */}
                                        <form id="frmUploader" enctype="multipart/form-data" action="/api/fileupload" method="post">
                                        <input type="file" name="fileupload" multiple/>
                                        <input type="submit" name="submit" id="btnSubmit" value="Upload" />
                                        </form>
                                            <div id="divloader" className="loader">
                                                <img src="./images/loader.gif" className="loaderImg"/>
                                            </div>
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
                        </div>
                        );
                    }
                }}
            </MediaQuery>
        );
    }
}

export default ProjectView;