import React, { Component } from 'react';
import { Image, Glyphicon } from 'react-bootstrap/lib';
import { CompactPicker } from 'react-color';
import Check from '../../images/check.png';
import layerActive from '../../images/LayerActive.png';
import layerNotActive from '../../images/LayerNotActive.png';
import MenuIcon from '../../images/MenuIcon.png';
import '../../css/layer.css';
// import CircularColor from 'react-circular-color';
import Feature from './featureInfo';

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
        this.removeColorPicker = this.removeColorPicker.bind(this);
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
        // debugger;
        return (
            <div>
                <div className="layer"> 
                    {
                        this.state.layerActive 
                        ? <Image src={Check} onClick={this.makeLayerInactive} style={{visibility : "visible"}} className="layer-on-off on-hover inline-display margin-outside" />
                        : <Image src={Check} onClick={this.makeLayerActive} style={{visibility : "hidden"}} className="layer-on-off on-hover inline-display margin-outside" />
                        // <Image src={} onClick={this.makeLayerActive} className="layer-on-off on-hover inline-display margin-outside" />
                    }
                    
                    <div className="inline-display align-vertical">
                        {/* <h4 className="layer-title on-hover margin-outside"> {this.props.layer.title}</h4>
                        <h6 className="layer-type margin-outside">{'(' + this.props.layer.type + ')'}</h6> */}
                        <h4 className="layer-title on-hover margin-outside">Layer Title</h4>
                        <h6 className="layer-type margin-outside">(Layer Type)</h6>
                    </div>
                    <div onClick={this.showColorPicker} className="color-rectangle on-hover inline-display"></div>
                    {/* <Image src={MenuIcon} className="menu-icon inline-display margin-outside" /> */}
                    <div className="dropdown">
                        {/* <Glyphicon className="menu-icon inline-display margin-outside" glyph="option-vertical" /> */}
                        <Image src={MenuIcon} className="menu-icon inline-display margin-outside" />
                            <div className="dropdown-content">
                                <a >Download</a>
                                <a >Table</a>
                                <a >Delete</a>
                            </div>
                    </div>
                    {/* <div className="tooltip">
                        <Image src={MenuIcon} className="menu-icon inline-display margin-outside" />
                        <Glyphicon className="menu-icon inline-display margin-outside" glyph="option-vertical" />Hello
                        <span className="tooltiptext">
                            <a >Download</a>
                            <a >Table</a>
                            <a >Delete</a>
                        </span>
                    </div>  */}
                    <hr className="layer-separator" />
                </div>
                {
                    this.state.colorPicker ? (<CompactPicker />) : null
                }
                {/* <Feature /> */}
            </div>
        );
    }
}

export default Layer;