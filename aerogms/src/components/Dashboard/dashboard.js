import React, { Component } from 'react';
import DashboardBodyAdmin from './dashboard-body-admin';
import NavbarAdmin from './navbar-dashboard-admin';
import {Redirect} from 'react-router-dom';

import '../../css/dashboard.css';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    render()
    {
        // if(!this.props.loggedIn)
        // {
        //   return <Redirect to={{pathname:'/login'}}/>
        // }
        // else{
        return (
            <div>
                <NavbarAdmin />
                <DashboardBodyAdmin />
            </div>
        );
        // }
    }
}

export default Dashboard;