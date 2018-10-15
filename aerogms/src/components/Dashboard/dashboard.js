import React, { Component } from 'react';
import DashboardBodyAdmin from './dashboard-body-admin';
import NavbarAdmin from './navbar-dashboard-admin';
import {Redirect} from 'react-router-dom';
import '../../css/dashboard.css';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {doLogin} from '../../actions';


class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    // componentDidMount()
    // {
    //     this.props.doLogin('prateekjain7676@gmail.com', '123456');
    // }

    render()
    {
        console.log('I am in dashboard');
        debugger
        console.log(this.props.userDetails);
        // if(!this.props.loggedIn)
        // {
        //   return <Redirect to={{pathname:'/login'}}/>
        // }
        // else{
        return (
            <div>
                <NavbarAdmin  loggedIn={this.state.loggedIn} username={this.state.username}/>
                <DashboardBodyAdmin />
            </div>
        );
    }
}

function mapStateToProps(state){
    return {userDetails: state.userDetails};
 }

function mapDispatchToProps(dispatch){
    return bindActionCreators({doLogin}, dispatch);
}

//export default Dashboard;
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);