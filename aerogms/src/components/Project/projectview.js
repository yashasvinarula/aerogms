import React, {Component} from 'react';
import { Image, Modal, DropdownButton, MenuItem } from 'react-bootstrap/lib';
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

    render(){
        return (
            <div>
                <div className="project-layer-box">
                    <div>
                        <h4 className="text-center ">Project Title</h4>
                    </div>
                    <hr className="separator-line"></hr>
                    <div className="row">
                        <div className="icons-display col-lg-6 left-padding">
                            <Image src={importLayer} className="add-import-icons " />
                            <span className="margin-outside">Import Layer</span>
                        </div>
                        <DropdownButton nocaret title={AddLayer}>
                            <MenuItem>Point</MenuItem>
                            <MenuItem>Line</MenuItem>
                            <MenuItem>Polygon</MenuItem>
                        </DropdownButton>
                    </div>
                    <hr className="separator-line"></hr>
                    <div>
                        <Layer />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectView;