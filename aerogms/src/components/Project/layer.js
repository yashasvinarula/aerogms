import React, { Component } from 'react';
import { Image, Modal, Button} from 'react-bootstrap/lib';
import { CompactPicker } from 'react-color';
import layerVisibleON from '../../images/LayerActive.png';
import layerVisibleOFF from '../../images/LayerNotActive.png';
import MenuIcon from '../../images/MenuIcon.png';
import '../../css/layer.css';
// import CircularColor from 'react-circular-color';
import Feature from './featureInfo';

class Layer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layerVisibleState : true,
            colorPicker : false,
            changelayername:false,
        }
        this.makeLayerVisible = this.makeLayerVisible.bind(this);
        this.makeLayerInVisible = this.makeLayerInVisible.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
        this.removeColorPicker = this.removeColorPicker.bind(this);
        this.closeChangeLayerModal = this.closeChangeLayerModal.bind(this);
        this.changeLayerName = this.changeLayerName.bind(this);
    };

    showColorPicker() {
        this.setState({ colorPicker : true });
    }

    removeColorPicker() {
        this.setState({ colorPicker : false});
    }

    makeLayerVisible() {
        this.setState({ layerVisibleState : true });
    }

    makeLayerInVisible() {
        this.setState({ layerVisibleState : false });
    } 

    closeChangeLayerModal(){
        this.setState({changelayername:false});
    }

    changeLayerName(){
        let newLayerTitle = document.getElementById('changeLayerName').value;
        this.props.changeLayerNameParent(newLayerTitle);
        this.closeChangeLayerModal();
    }


    render() {
        // debugger;
        return (
            <div>
                <div className="layer"> 
                    {
                        this.state.layerVisibleState 
                        ? <Image src={layerVisibleON} onClick={this.makeLayerInVisible} className="layer-on-off on-hover inline-display margin-outside" />
                        : <Image src={layerVisibleOFF} onClick={this.makeLayerVisible} className="layer-on-off on-hover inline-display margin-outside" />
                    }
                    <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display margin-outside"></div>
                    <div className="inline-display">
                        <h4 className="layer-title on-hover margin-outside" onClick={()=>this.setState({changelayername:true})}> {this.props.layer.name}</h4>
                        <Modal className="modal-custom"
                                show={this.state.changelayername}
                                onHide={this.closeChangeLayerModal}
                                container={this}>
                            
                                <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                <Modal.Body>
                                    {/* <label htmlFor="layerTitle">Enter Name</label> */}
                                    <input type="text" id="changeLayerName" placeholder="Enter Name"/>
                                    <Button onClick={this.changeLayerName}>Update</Button>
                                </Modal.Body>
                            </Modal>
                        <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6>
                        {/* <h4 className="layer-title on-hover margin-outside">Layer Title</h4>
                        <h6 className="layer-type margin-outside">(Layer Type)</h6> */}
                    </div>
                    {/* <Image src={MenuIcon} className="menu-icon inline-display margin-outside" /> */}
                    <div className="dropdown">
                        {/* <Glyphicon className="menu-icon inline-display margin-outside" glyph="option-vertical" /> */}
                        <Image src={MenuIcon} className="menu-icon inline-display margin-outside" />
                            <div className="dropdown-content">
                                <a href="">Download</a>
                                <a href="">Table</a>
                                <a href="">Delete</a>
                            </div>
                    </div>
                    {/* <div className="tooltip">
                        <Image src={MenuIcon} className="menu-icon inline-display margin-outside" />
                        <Glyphicon className="menu-icon inline-display margin-outside" glyph="option-vertical" />Hello
                        <span className="tooltiptext">
                            <a href="#">Download</a>
                            <a href="#">Table</a>
                            <a href="#">Delete</a>
                        </span>
                    </div> */}
                    <hr className="layer-separator" />
                </div>
                {/* <CircularColor /> */}
                {
                    this.state.colorPicker ? (<CompactPicker />) : null
                }
                {/* <Feature /> */}
            </div>
        );
    }
}

export default Layer;