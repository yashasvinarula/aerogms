import React, { Component } from 'react';
import { Image, Button, Glyphicon  } from 'react-bootstrap/lib';
import { SketchPicker } from 'react-color';
import layerActive from '../../images/LayerActive.png';
import layerNotActive from '../../images/LayerNotActive.png';
import MenuIcon from '../../images/MenuIcon.png';
import '../../css/layer.css';
import CircularColor from 'react-circular-color';
class Layer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layerActive : true,
            colorPicker : false,
        }
        this.makeLayerActive = this.makeLayerActive.bind(this);
        this.makeLayerInactive = this.makeLayerInactive.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
    };

    showColorPicker() {
        this.setState({ colorPicker : true });
    }

    removeColorPicker() {
        this.setState({ colorPicker : false});
    }

    makeLayerActive() {
        this.setState({ layerActive : true });
    }

    makeLayerInactive() {
        this.setState({ layerActive : false });
    }

    render() {
        return (
            <div>
            <div className="layer"> 
                {
                    this.state.layerActive 
                    ? <Image src={layerActive} onClick={this.makeLayerInactive} className="layer-on-off inline-display margin-outside" />
                    : <Image src={layerNotActive} onClick={this.makeLayerActive} className="layer-on-off inline-display margin-outside" />
                }
                <div onClick={this.showColorPicker} className="color-rectangle inline-display margin-outside"></div>
                <div className="inline-display">
                    <h4 className="layer-title margin-outside">Layer Title</h4>
                    <h6 className="layer-type margin-outside">(Layer Type)</h6>
                </div>
                {/* <Image src={MenuIcon} className="menu-icon inline-display margin-outside" /> */}
                <div class="dropdown">
                    <Glyphicon className="menu-icon inline-display margin-outside" glyph="option-vertical" />
                    <div class="dropdown-content">
                        <a href="#">Download</a>
                        <a href="#">Table</a>
                        <a href="#">Delete</a>
                    </div>
                </div>
                <hr className="layer-separator" />
            </div>
            <CircularColor />
            {
                this.state.colorPicker ? (<SketchPicker />) : null
            }
            
            </div>
        );
    }
}

export default Layer;