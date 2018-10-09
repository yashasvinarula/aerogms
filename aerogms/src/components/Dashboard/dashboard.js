import React, { Component } from 'react';
import DashboardBodyAdmin from './dashboard-body-admin';
import NavbarAdmin from './navbar-dashboard-admin';

import '../../css/dashboard.css';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return (
            <div>
                <NavbarAdmin />
                <DashboardBodyAdmin />
            </div>
        );
    }
}

export default Dashboard;