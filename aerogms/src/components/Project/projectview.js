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
            remFeature:false
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
               return (<Layer key={layer.name} layer={layer} changeLayerNameParent={(name)=>{layer.name = name}}/>);
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
            <div>
            <input style={{marginTop:20}} type="button" id="btnMakePoint" value="AddPoint" onClick={this.addPoint}/>
            <input style={{marginLeft:5, marginTop:20}} type="button" id="btnMakeLine" value="AddLine" onClick={this.addLine}/>
            <input style={{marginLeft:5, marginTop:20}} type="button" id="btnMakePolygon" value="AddPolygon" onClick={this.addPolygon}/>
            <input style={{marginLeft:5, marginTop:20}} type="button" id="saveLayer" value="Save Layer" onClick={this.saveLayer}/>
            <input style={{marginLeft:5, marginTop:20, visibility:"hidden"}}  type="button" id="removeFeature" value="Remove Feature" onClick={this.removeFeature}/>
                <div className="project-layer-box">
                    <div>
                        <h4 className="text-center ">Project Title</h4>
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
                                    {/* <label htmlFor="layerTitle">Enter Name</label> */}
                                    <input type="text" id="layer-title" placeholder="Enter Name"/>
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