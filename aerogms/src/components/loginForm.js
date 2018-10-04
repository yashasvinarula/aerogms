import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import '../App.css';
import AeroLogo from '../images/AeroLOGO.png';
import BuildingsImage from '../images/login-page-image.png'
import Navbar from './navbar';

class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirectTo: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
  
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        

        axios
            .post('/user/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                    // update App.js state
                    this.props.updateUser({
                        loggedIn: true,
                        username: response.data.username
                    })
                    // update the state to redirect to home
                    this.setState({
                        redirectTo: '/'
                    })
                }
            }).catch(error => {
                console.log('login error: ')
                console.log(error);
                
            })
    }
    
    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div>
                    <div className="top-margin">
                        <div className="row">
                            <div className="col m1 offset m1"></div>
                            <div className="col m5">
                                <h3 className="center">Welcome to AeroGMS</h3>
                                <hr className="hr-row"></hr>
                                <p className="center">Geographic Management System is a framework for city administrators to collect, 
                                    analyze and extract useful information for cities and towns. It encompasses all
                                     aspects of management and planning process in an organization from servey to 
                                     advanced analytics.
                                </p>
                                <img src={BuildingsImage} className="buildings-image"></img>
                            </div>
                            <div className="col m1 offset m1"></div>
                            <div className="col m1 offset m1"></div>
                            <div className="col m3 border-css form-height side-margin">
                                <img src={AeroLogo} className="img-logo"></img>
                                <form className="">
                                    <div className="">
                                    <div className="">
                                        <label className="" htmlFor="username">Enter Username</label>
                                    </div>
                                    <div className="">
                                        <input className="validate" type="text" id="username" name="username" required="true" placeholder=""
                                            value={this.state.username} onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                    <div className="">
                                    <div className="">
                                        <label className="" htmlFor="password">Enter Password</label>
                                    </div>
                                    <div className="">
                                        <input className="validate" placeholder="" type="password" name="password" required="true"
                                            value={this.state.password} onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                    <div className=" ">
                                        <div className="">
                                            <button className="btn btn-auth col s12" onClick={this.handleSubmit} type="submit">Login</button>
                                        </div>
                                        <div className="">
                                            <a href="/signup" className="btn col s12">New User? Sign up</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col m1 offset m1"></div>
                        </div>
                    </div>
                        
                </div>
            )
        }
    }
}

export default LoginForm;