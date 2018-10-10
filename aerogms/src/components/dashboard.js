import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

class Dashboard extends Component{
    constructor(props) {
        debugger
        super(props)
        //const user = this.props.username
        //console.log(user);
    }

    render() {
        if(!this.props.loggedIn)
        {
          return <Redirect to={{pathname:'/login'}}/>
        }
        else{
            return (
                <div>
                    <p>`Welcome {this.props.username}..! You are at the dashboard.`</p>
                </div>
            )
        }
        
    }
}
export default Dashboard