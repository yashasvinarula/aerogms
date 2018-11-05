import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { Image, DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap/lib';
import LayerVisible from '../../images/LayerVisible.png';
import LayerInvisible from '../../images/LayerInvisible.png';
import MenuIcon from '../../images/Menu.png';
import AddAttribute from '../../images/add-attribute.png';
import '../../css/layer.css';
import Feature from './featureInfo';

const MenuImage = ( <Image src={MenuIcon} className="menu-icon inline-display margin-outside" />);

class Layer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layerVisibleState : true,
            changelayername:false,
            colorPicker : false,
            showTable : false,
            attributes : [1,2,3],
            showAttrForm : false,
        }
        this.makeLayerVisible = this.makeLayerVisible.bind(this);
        this.makeLayerInVisible = this.makeLayerInVisible.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
        this.removeColorPicker = this.removeColorPicker.bind(this);
        this.closeChangeLayerModal = this.closeChangeLayerModal.bind(this);
        this.changeLayerName = this.changeLayerName.bind(this);
        this.closeTableModal = this.closeTableModal.bind(this);
        }

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
    closeTableModal() {
        this.setState({showTable : false});
    }

    render() {
        // debugger;
        return (
            <div>
                    <div className="layer"> 
                        <input type="radio" name="group1" className="input-layer col-xs-2" />
                        <div className="inline-display align-vertical">
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
                        </div>
                        <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display "></div>
                        {
                            !this.props.layersInfo
                            ?
                                (this.state.layerVisibleState 
                                ? <Image src={LayerVisible} onClick={this.makeLayerInvisible} className="visibility-icon on-hover inline-display margin-outside" />
                                : <Image src={LayerInvisible} onClick={this.makeLayerVisible} className="visibility-icon on-hover inline-display margin-outside" />)
                            :
                                (<DropdownButton
                                    title={MenuImage}
                                    noCaret
                                    pullRight
                                  >
                                    <MenuItem>Download</MenuItem>
                                    <MenuItem onClick={() => this.setState({showTable : true})}>Table</MenuItem>
                                        <Modal
                                            show={this.state.showTable}
                                            onHide={this.closeTableModal}
                                            container={this}
                                        >
                                            <Modal.Header closeButton>Layer Title</Modal.Header>
                                            <Modal.Body>
                                                <ul>
                                                    {
                                                        this.state.attributes.map((attr) => {
                                                            return (<li>{attr}</li>)
                                                        })
                                                    }
                                                </ul>
                                                {
                                                    this.state.showAttrForm ? 
                                                    (<form>
                                                        <label>Title</label>
                                                        <input type="text" id="attr-title"/>
                                                        <label>Type</label>
                                                        <ul id="group2">
                                                            <input name="group2" type="radio" value="number" defaultChecked  />Numeric
                                                            <input name="group2" type="radio" value="text" />Text   
                                                        </ul>
                                                        <Button>Submit</Button>
                                                    </form>)
                                                    : ''
                                                }
                                                <Image src={AddAttribute} onClick={() => this.setState({showAttrForm : true})} className="add-attribute" />
                                            </Modal.Body>
                                        </Modal>
                                    <MenuItem>Delete</MenuItem>
                                </DropdownButton>)
                        }
                        <hr className="layer-separator" />
                        {
                            this.state.colorPicker ? (<CompactPicker />) : null
                        }
                    </div>
                {/* <Feature /> */}
            </div>
        );
    }
}

export default Layer;