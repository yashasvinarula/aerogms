import React, {Component} from 'react';
import {  Image, DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap/lib';
import { slide as Menu } from 'react-burger-menu';
import MediaQuery from 'react-responsive';
import Layer from './layer';
import Analytics from './analytics';
import Validation from './validation';
import LayersPNG from '../../images/NewLayer.png';
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
            layer : {active : '', title : '', type : '', color : '', strokeColor : ''},
            layers : [],
            layerList : false,
            analytics : false,
            validation : false,
            map : false,
        }
        
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeAddLayerModal = this.closeAddLayerModal.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
    }

    closeImportModal() {
        this.setState({ showImportModal : false});
    }
    closeAddLayerModal() {
        this.setState({ showAddLayerModal : false });
    }
    addLayer() {
        let newLayerTitle = document.getElementById('layer-title').value;
        let newLayer = this.state.layer;
            newLayer.active = true;
            newLayer.title = newLayerTitle;
            newLayer.type = this.state.layerType;
            newLayer.backgroundColor = '4D4D4D';
            newLayer.outline = 'B3B3B3';
        this.setState({ layer : newLayer });
        let newLayers = this.state.layers;
        newLayers.push(newLayer);
        this.setState({ layers : newLayers });
        this.closeAddLayerModal();
    }
    renderLayers() {
        if(this.state.layers.length !== 0) {
            return this.state.layers.map((layer) => {
               return (<li><input type="radio" name="group1" /><Layer layer={layer}/></li>);
            });
        }
    }

    render(){
        return (
            <MediaQuery maxWidth={768}>
                {(matches) => {
                    if(matches) {
                        return (
                            <div className="green-back">
                                <div className="project-nav">
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
                                    <Image src={LayersPNG} onClick={() => this.setState({layerList : true, validation : false, analytics : false})} className="layers-image" />
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
                                            <ul id="group1">
                                                <li><input type="radio" name="group1" /><Layer /></li>
                                                <li><input type="radio" name="group1" /><Layer /></li>
                                                <li><input type="radio" name="group1" /><Layer /></li>
                                            </ul>
                                        </div>
                                        <div className="bottom-layers-panel">
                                            <ul className="">
                                                <li className="">Info</li>
                                                <li className="">Visibility</li>
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
                            <div className="green-back">
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
                                    <ul id="group1">
                                        <li><input type="radio" name="group1" /><Layer /></li>
                                        <li><input type="radio" name="group1" /><Layer /></li>
                                        <li><input type="radio" name="group1" /><Layer /></li>
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