import React, { Component } from 'react';
import { Image, DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap/lib';
import { CompactPicker } from 'react-color';
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
            layerVisible : true,
            colorPicker : false,
            showTable : false,
            attributes : [1,2,3],
            showAttrForm : false,
        }
        this.makeLayerVisible = this.makeLayerVisible.bind(this);
        this.makeLayerInvisible = this.makeLayerInvisible.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
        this.removeColorPicker = this.removeColorPicker.bind(this);
        this.closeTableModal = this.closeTableModal.bind(this);
    };

    showColorPicker() {
        this.setState({ colorPicker : true });
    }
    // addAttribute() {
    //     let newAttributes = [];
    //     newAttributes = this.state.attributes;
    //     let attrTitle = document.getElementById('attr-title').value;
    //     let attrType = 

    // }
    removeColorPicker() {
        this.setState({ colorPicker : false});
    }
    closeTableModal() {
        this.setState({showTable : false});
    }
    makeLayerVisible() {
        this.setState({ layerVisible : true });
    }
    makeLayerInvisible() {
        this.setState({ layerVisible : false });
    }

    render() {
        // debugger;
        return (
            <div>
                    <div className="layer"> 
                        <input type="radio" name="group1" className="input-layer col-xs-2" />
                        <div className="inline-display align-vertical">
                            {/* <h4 className="layer-title on-hover margin-outside"> {this.props.layer.title}</h4>
                            <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6> */}
                            <h4 className="layer-title on-hover margin-outside">Layer Title</h4>
                            <h6 className="layer-type margin-outside">(Layer Type)</h6>
                        </div>
                        <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display "></div>
                        {
                            !this.props.layersInfo
                            ?
                                (this.state.layerVisible 
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