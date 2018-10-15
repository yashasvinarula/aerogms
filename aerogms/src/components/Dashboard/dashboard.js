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
        console.log(this.props);
        console.log('I am in dashboard: ' + this.props.userDetails.email);
        if(!this.props.userDetails.isLoggedIn)
        {
          return <Redirect to={{pathname:'/login'}}/>
        }
        return (
            <div>
                <NavbarAdmin username={this.props.userDetails.username} isLoggedIn={this.props.userDetails.isLoggedIn} doLogout={this.props.doLogout}/>
                <DashboardBodyAdmin />
            </div>
        );
    }
}

export default Dashboard;