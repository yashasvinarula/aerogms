import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { Table, Pager, ButtonGroup, Button, Popover, OverlayTrigger, overlay } from 'react-bootstrap/lib';
import axios from 'axios';
import '../../css/dashboard.css';

const popoverleft = (
    <Popover id="popover-positioned-left">
        <div>
            <a className="popover-anchor">Edit</a>
            <a className="popover-anchor">Remove</a>
            <a className="popover-anchor">Toggle Status</a>
            <a className="popover-anchor">Details</a>
        </div>
    </Popover>
);

class DashboardBodyAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : '',
            username : '',
            regDate : '',
            status : '',
        }
        this.fetchUsers = this.fetchUsers.bind(this);
    }

    fetchUsers() {
        axios.get('/fetchUsers').then((response) => {
            console.log('fetchusers response');
            if(response.status === 200){
                
            }
        });
    }

    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>User Name <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                            <th>Registraion Date <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                            <th>Status <span bsSize="small"><Glyphicon glyph="sort" /></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1234AB</td>
                            <td>Parveen Sahrawat</td>
                            <td>04-12-17</td>
                            <td>Enabled</td>
                            <span bsSize="small">
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverleft}>
                                        <Glyphicon glyph="option-vertical" />
                                    </OverlayTrigger>
                            </span>
                        </tr>
                    </tbody>
                </Table>
                <Pager>
                    <Pager.Item previous href="#">Previous</Pager.Item>{' '}
                    <Pager.Item next href="#">Next</Pager.Item>
                </Pager>
            </div>
        );
    }
}
export default DashboardBodyAdmin;