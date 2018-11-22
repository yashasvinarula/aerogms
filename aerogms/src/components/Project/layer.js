import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { Image, DropdownButton, MenuItem, Modal, Button, Table } from 'react-bootstrap/lib';
import LayerVisible from '../../images/LayerVisible.png';
import LayerInvisible from '../../images/LayerInvisible.png';
// import MenuIcon from '../../images/Menu.png';
import InfoIcon from '../../images/InfoIcon.png';
import AddAttribute from '../../images/add-attribute.png';
import MediaQuery from 'react-responsive';
import '../../css/layer.css';
import axios from 'axios';
import Feature from './featureInfo';
import TextIcon from '../../images/TextIcon.png';
import NumberIcon from '../../images/NumberIcon.png';
import {connect} from 'react-redux';
import {delete_layer} from '../../actions';
// import Feature from './featureInfo';

const MenuImage = ( <Image src={InfoIcon} className="menu-icon inline-display margin-outside" />);
const MenuIcon = ( <Image src={InfoIcon} className="attr-menu-icon" />);

class Layer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layerVisibleState : true,
            changelayername:false,
            colorPicker : false,
            showAttributes : false,
            attributeType : '',
            attributeName : '',
            tempAttr : '',
            attributes : [{type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
            {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
            {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
            {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
            {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
            {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'}, {type : 'text', name : 'abc'},
        ],
            showAttrForm : false,
            renameAttribute : false,
        }
        this.makeLayerVisible = this.makeLayerVisible.bind(this);
        this.makeLayerInVisible = this.makeLayerInVisible.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
        this.removeColorPicker = this.removeColorPicker.bind(this);
        this.closeChangeLayerModal = this.closeChangeLayerModal.bind(this);
        this.changeLayerName = this.changeLayerName.bind(this);
        this.closeAttrModal = this.closeAttrModal.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteAttr = this.deleteAttr.bind(this);
        this.renameAttr = this.renameAttr.bind(this);
        this.deleteLayer = this.deleteLayer.bind(this);
    };

    showColorPicker() {
        this.setState({ colorPicker : true });
    }
    removeColorPicker() {
        this.setState({ colorPicker : false});
    }

    makeLayerVisible() {
        this.setState({ layerVisibleState : true });
        window.addWMSLayer(this.props.layer.orig_name);

    }

    makeLayerInVisible() {
        this.setState({ layerVisibleState : false });
        window.hideWMSLayer(this.props.layer.orig_name);

    } 

    closeChangeLayerModal(){
        this.setState({changelayername:false});
    }


    changeLayerName(){
        let newLayerTitle = document.getElementById('changeLayerName').value;
        axios.post('/api/lay_name_exists', {
            lay_name: newLayerTitle
        })
        .then(responce=>{
            debugger
            console.log(responce);
            if(responce.data.status == 'not exists'){
                this.props.changeLayerNameParent(newLayerTitle);
                this.closeChangeLayerModal();
            }
            else{
                alert('layer name is already exists! Please try with another name.')
            }
        })
        .catch(err=>{
            console.log('error: ' + err)
        })
    }
    closeAttrModal() {
        this.setState({showAttributes : false});
    }
    handleChange(event) {
        this.setState({attributeName : event.target.value});
    }
    handleRadioChange(event) {
        this.setState({attributeType : event.target.value});
    }

    componentDidMount(){
        debugger
        window.addWMSLayer(this.props.layer.orig_name);
    }

    handleSubmit(event) {
        event.preventDefault();
        let newAttribute = {name: '', type: ''};
        newAttribute.name = this.state.attributeName;
        newAttribute.type = this.state.attributeType;
        if(this.state.attributeName ==='' || this.state.attributeType === ''){
            alert('Please fill all fields');
        } else {
            let flag = 0;
            this.state.attributes.map((attr) => {
                if(attr.name === this.state.attributeName) {
                    event.target.reset();
                    flag = 1;
                    return(alert('Attribute with this name already exists.'));
                }
            });

            if( flag === 0) {
                let newAttribute = {name: '', type: ''};
                newAttribute.name = this.state.attributeName;
                newAttribute.type = this.state.attributeType;
                this.setState({attributes : [...this.state.attributes, newAttribute], 
                    showAttrForm : false, attributeName : '', attributeType : ''});
                event.target.reset();
            }
        }
    }
    deleteAttr(event) {
        let attrArray = [...this.state.attributes];
        let attrIndex = attrArray.findIndex(attribute => attribute.name === event.target.name );
        if(attrIndex !== -1) {
            attrArray.splice(attrIndex, 1);
            window.confirm('Do you really want to delete this attribute ?') ? this.setState({attributes : attrArray}) : '';
        }
    }
    renameAttr(event) {
        event.preventDefault();
        let tempAttribute = this.state.tempAttr;
        let attrArray = [...this.state.attributes];
        let attrIndex = attrArray.findIndex(attribute => attribute.name === tempAttribute );
        if(attrIndex !== -1 && attrIndex !== 'undefined') {
            console.log(`attr :  ${attrIndex}`);
            attrArray[attrIndex].name = this.state.attributeName;
            this.setState({ attributes : attrArray, renameAttribute : false, attributeName : '', tempAttr : '' })
        }
    }
    // removeLayer(){
    //     window.hideWMSLayer(this.props.layer.orig_name);
    // }

    // addLayer(){
    //     window.addWMSLayer(this.props.layer.orig_name);
    // }
    deleteLayer(){
        if(window.confirm(`Do you really want to delete ${this.props.layer.name} layer.`)){
            if(this.props.layer.orig_name && this.props.layer.lay_id)
            {
                this.props.delete_layer(this.props.layer.orig_name, this.props.layer.lay_id);
                window.hideWMSLayer(this.props.layer.orig_name);
            }
        }
    }

    render() {
        return (
            <MediaQuery maxWidth={768}>
            {(matches) => {
                if(matches) {
                    return (
                        <div>
                        <div className="layer"> 
                            {/* {
                                this.props.layersInfo 
                                ? (<input type="radio" name="group1" className="input-layer col-xs-2" />) 
                                : ''
                            } */}
                            {
                                this.props.layersInfo
                                ? (<span onClick={this.showColorPicker} className="color-rectangle on-hover inline-display"></span>)
                                : ''
                            }
                            <div className="inline-display layer-title-box">
                                <h4 className="layer-title on-hover margin-outside" onClick={()=>this.setState({changelayername:true})}> {this.props.layer.name}</h4>
                                <Modal className="modal-custom"
                                    show={this.state.changelayername}
                                    onHide={this.closeChangeLayerModal}
                                    container={this}>
                                    <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                    <Modal.Body>
                                        {/* <label htmlFor="layerTitle">Enter Name</label> */}
                                        <input type="text" id="changeLayerName" placeholder="Enter Name" />
                                        <Button onClick={this.changeLayerName}>Update</Button>
                                    </Modal.Body>
                                </Modal>
                                <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6>
                            </div>
                           
                            {
                                !this.props.layersInfo
                                ?
                                    (this.state.layerVisibleState 
                                    ? <Image src={LayerVisible} onClick={this.makeLayerInVisible} className="visibility-icon on-hover inline-display" />
                                    : <Image src={LayerInvisible} onClick={this.makeLayerVisible} className="visibility-icon on-hover inline-display" />)
                                :
                                    (<DropdownButton
                                        title={MenuImage}
                                        noCaret
                                        pullRight
                                      >
                                      <style type="text/css">{`
                                        .btn-group {
                                            position: absolute;
                                            right: 10px;
                                            vertical-align: middle;
                                        }
                                      `}</style>
                                        <MenuItem>Download</MenuItem>
                                        <MenuItem onClick={() => this.setState({showAttributes : true})}>Attributes</MenuItem>
                                            <Modal
                                                show={this.state.showAttributes}
                                                onHide={this.closeAttrModal}
                                                container={this}
                                            >
                                                <Modal.Header closeButton>Layer Title</Modal.Header>
                                                <Modal.Body>
                                               
                                                    {   !this.state.showAttrForm ?
                                                           (
                                                            <div>
                                                            {
                                                                (this.state.attributes.length > 0) ? 
                                                                    !this.state.renameAttribute ? 
                                                                    (<div>
                                                                        <h5>Attributes List</h5>
                                                                        <Table className="attr-list" striped>
                                                                            <thead className="attr-thead">
                                                                                <tr>
                                                                                    <th>Type</th>
                                                                                    <th>Name</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <style type="text/css">{`
                                                                                    .modal-body {
                                                                                        max-height: 500px;
                                                                                        overflow: auto;
                                                                                    }
                                                                                `}</style>
                                                                                {
                                                                                    this.state.attributes.map((attr, index) => {
                                                                                        let typeIcon;
                                                                                        switch(attr.type) {
                                                                                            case 'text':
                                                                                                typeIcon = TextIcon;
                                                                                                break;
                                                                                            case 'number':
                                                                                                typeIcon = NumberIcon;
                                                                                                break;
                                                                                            default:
                                                                                                break;        
                                                                                        }
                                                                                        return (<tr className="attr-list-item">
                                                                                                    <td><Image src={typeIcon} className="attr-type-icon" /></td>
                                                                                                    <td>{attr.name}</td>
                                                                                                    <td>
                                                                                                        <DropdownButton
                                                                                                            title={MenuIcon}
                                                                                                            noCaret pullRight
                                                                                                        >
                                                                                                            <MenuItem onClick={() => this.setState({renameAttribute : true, tempAttr : attr.name})}>Rename</MenuItem>
                                                                                                            <MenuItem onClick={this.deleteAttr} name={attr.name}>Delete</MenuItem>
                                                                                                        </DropdownButton>
                                                                                                    </td>
                                                                                                </tr>);
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </Table>
                                                                        <Button className="add-attr" onClick={() => this.setState({showAttrForm : true})} >Add Attribute</Button>
                                                                    </div>)
                                                                :   
                                                                (
                                                                    <form>
                                                                        <label>Name
                                                                            <input type="text" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                                        </label>
                                                                        <Button type="submit" onClick={this.renameAttr} className="custom-button">Rename</Button>
                                                                    </form>
                                                                )
                                                                : ''
                                                            }
                                                        </div>
                                                        )
                                                        : 
                                                            (<form onSubmit={this.handleSubmit.bind(this)}>
                                                                <label>Name
                                                                <input type="text" id="attr-title" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                                </label>
                                                                <label>Type</label>
                                                                <ul>
                                                                    <li>
                                                                        <label>
                                                                            <input className="radio-input" 
                                                                            type="radio" value="text"
                                                                            onChange={this.handleRadioChange} 
                                                                            checked={this.state.attributeType === "text"} />Text
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            <input className="radio-input" 
                                                                            type="radio" value="number"
                                                                            onChange={this.handleRadioChange} 
                                                                            checked={this.state.attributeType === "number"} />Numeric
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                                <Button type="submit" className="custom-button">Add</Button>
                                                            </form>)
                                                    }
                                                </Modal.Body>
                                            </Modal>
                                        <MenuItem>Table</MenuItem>    
                                        <MenuItem>Delete</MenuItem>
                                    </DropdownButton>)
                            }
                            
                            {
                                this.state.colorPicker ? (<CompactPicker />) : null
                            }
                        </div>
                        <hr className="layer-separator" />
                    {/* <Feature /> */}
                </div>
                    );
                } else {
                    return (
                        <div>
                        <div className="layer"> 
                            {/* <input type="radio" name="group1" className="input-layer col-xs-2" /> */}
                            {
                                this.state.layerVisibleState 
                                    ? <Image src={LayerVisible} onClick={this.makeLayerInVisible} className="visibility-icon on-hover inline-display margin-outside" />
                                    : <Image src={LayerInvisible} onClick={this.makeLayerVisible} className="visibility-icon on-hover inline-display margin-outside" />
                            }
                            <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display "></div>
                            <div className="inline-display layer-title-box">
                                <h4 className="layer-title on-hover margin-outside" onClick={()=>this.setState({changelayername:true})}> {this.props.layer.name}</h4>
                                <Modal className="modal-custom"
                                        show={this.state.changelayername}
                                        onHide={this.closeChangeLayerModal}
                                        container={this}>
                                        <Modal.Header closeButton>Enter Layer Name</Modal.Header>
                                        <Modal.Body>
                                            <input type="text" id="changeLayerName" placeholder="Enter Name"/>
                                            <Button onClick={this.changeLayerName}>Update</Button>
                                        </Modal.Body>
                                </Modal>
                                <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6>
                            </div>
                            
                            <DropdownButton
                                title={MenuImage}
                                noCaret
                                pullRight
                              >
                              <style type="text/css">{`
                              .btn-group {
                                  position: absolute;
                                  right: 5px;
                                  vertical-align: middle;
                              }
                            `}</style>
                                <MenuItem>Download</MenuItem>
                                <MenuItem onClick={() => this.setState({showAttributes : true})}>Attributes</MenuItem>
                                    <Modal
                                        show={this.state.showAttributes}
                                        onHide={this.closeAttrModal}
                                        container={this}
                                    >
                                        <Modal.Header closeButton>Layer Title</Modal.Header>
                                        <Modal.Body>
                                        
                                            {
                                                !this.state.showAttrForm ? 
                                                    (
                                                        <div>
                                                            {
                                                                (this.state.attributes.length > 0) ? 
                                                                    !this.state.renameAttribute ? 
                                                                    (<div>
                                                                        <h5>Attributes List</h5>
                                                                        <Table className="attr-list" striped>
                                                                            <thead className="attr-thead">
                                                                                <tr>
                                                                                    <th>Type</th>
                                                                                    <th>Name</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <style type="text/css">{`
                                                                                    .modal-body {
                                                                                        max-height: 500px;
                                                                                        overflow: auto;
                                                                                    }
                                                                                `}</style>
                                                                                {
                                                                                    this.state.attributes.map((attr, index) => {
                                                                                        let typeIcon;
                                                                                        switch(attr.type) {
                                                                                            case 'text':
                                                                                                typeIcon = TextIcon;
                                                                                                break;
                                                                                            case 'number':
                                                                                                typeIcon = NumberIcon;
                                                                                                break;
                                                                                            default:
                                                                                                break;        
                                                                                        }
                                                                                        return (<tr className="attr-list-item">
                                                                                                    <td><Image src={typeIcon} className="attr-type-icon" /></td>
                                                                                                    <td>{attr.name}</td>
                                                                                                    <td>
                                                                                                        <DropdownButton
                                                                                                            title={MenuIcon}
                                                                                                            noCaret pullRight
                                                                                                        >
                                                                                                            <MenuItem onClick={() => this.setState({renameAttribute : true, tempAttr : attr.name})}>Rename</MenuItem>
                                                                                                            <MenuItem onClick={this.deleteAttr} name={attr.name}>Delete</MenuItem>
                                                                                                        </DropdownButton>
                                                                                                    </td>
                                                                                                </tr>);
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </Table>
                                                                        <Button className="add-attr" onClick={() => this.setState({showAttrForm : true})} >Add Attribute</Button>
                                                                    </div>)
                                                                :   
                                                                (
                                                                    <form>
                                                                        <label>Name
                                                                            <input type="text" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                                        </label>
                                                                        <Button type="submit" onClick={this.renameAttr} className="custom-button">Rename</Button>
                                                                    </form>
                                                                )
                                                                : ''
                                                            }
                                                        </div>
                                                    )
                                                :   
                                                    (<form onSubmit={this.handleSubmit}>
                                                        <label>Name
                                                            <input type="text" id="attr-title" onChange={this.handleChange} placeholder="Enter attribute name" />
                                                        </label>
                                                        <label>Type</label>
                                                        <ul>
                                                            <li>
                                                                <label>
                                                                    <input className="radio-input"
                                                                    type="radio" value="text"
                                                                    onChange={this.handleRadioChange} 
                                                                    checked={this.state.attributeType === "text"} />Text
                                                                </label>
                                                            </li>
                                                            <li>
                                                                <label>
                                                                    <input className="radio-input" 
                                                                    type="radio" value="number"
                                                                    onChange={this.handleRadioChange} 
                                                                    checked={this.state.attributeType === "number"} />Numeric
                                                                </label>
                                                            </li>
                                                        </ul>
                                                        <Button type="submit" className="custom-button">Add</Button>
                                                    </form>)
                                            }
                                        </Modal.Body>
                                    </Modal>
                                <MenuItem>Table</MenuItem>
                                <MenuItem onClick={()=>this.deleteLayer()}>Delete</MenuItem>
                            </DropdownButton>
                            
                            {
                                this.state.colorPicker ? (<CompactPicker />) : null
                            }
                        </div>
                        <hr className="layer-separator" />
                    {/* <Feature /> */}
                </div>
                    );
                }
            }}
            </MediaQuery>
        );
    }
}

export default connect(null, {delete_layer})(Layer);