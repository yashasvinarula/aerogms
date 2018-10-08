import React, { Component } from 'react';

class Dashboard extends Component{
    constructor(props) {
        super(props)
        debugger;
       const user = this.props.location.state.user;
        console.log(user);
    }

    render() {
        return (
            <div>
                <p>You are at the dashboard.</p>

            </div>
        )
    }
}
export default Dashboard