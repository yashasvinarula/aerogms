import React, { Component } from 'react';
import './login-form';
import LoginForm from '../loginForm';

class LoginMain extends Component {
    constructor(){
        super();
        this.state = {

        }
    }
    render(){
        return(
            <LoginForm />
        );
    }
}

export default LoginMain;