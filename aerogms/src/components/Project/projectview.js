import React, {Component} from 'react';
import { Image, DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap/lib';
import Layer from './layer';
import '../../css/project.css';
import addLayer from '../../images/AddLayerPNG.png';
import importLayer from '../../images/ImportLayerPNG.png';
// class AddLayer extends Component {
//     render() {
    const AddLayer = 
        (
            <div className="icons-display col-lg-6">
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
               return (<Layer layer={layer}/>);
            });
        }
    }

    render(){
        return (
            <div>
                <div className="project-layer-box">
                    <div>
                        <h4 className="text-center ">Project Title</h4>
                    </div>
                    <hr className="separator-line"></hr>
                    <div className="row">
                        <div className="icons-display on-hover col-lg-6 left-padding" onClick={() => this.setState({ showImportModal : true })}>
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
                            nocaret="true" 
                            title={AddLayer}
                            id="dropdown-no-caret" >
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
                        {this.renderLayers()}
                        {/* <Layer /> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectView;