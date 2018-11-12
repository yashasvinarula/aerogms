import React, { Component } from 'react';
import{ Image, } from 'react-bootstrap/lib';
import CrossIcon from '../../images/CrossIcon.png';
import '../../css/bottom-drawer.css';

class BottomDrawer extends Component {
    
    render() {
        
        return (
            <div className={`slider ${this.props.drawerStates.close}${this.props.drawerStates.sliderPartial}`}>
                {
                    this.props.drawerStates.more
                    ? (<h5 className="more-option" onClick={this.props.openFullDrawer}>more ...</h5>)
                    : (<Image src={CrossIcon} className="cross-icon" onClick={this.props.closeDrawer} />)
                }
                <ul>
                    <li>Attr1</li>
                    <li>Attr2</li>
                    <li>Attr3</li>
                    <li>Attr4</li>
                    <li>Attr5</li>
                </ul>
            </div>
        );
    }
}

export default BottomDrawer;