import React, { Component } from 'react';
import axios from 'axios';

class Forgot extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            emailValid : '',
            formError : { email : '' },
        } 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value }, () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let emailValid = this.state.emailValid;
        let fieldValidationError = this.state.formError;
        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationError.email = emailValid ? '' : 'Email is invalid';
                break; 
            default:
                break;  
        }
        this.setState({ emailValid : emailValid });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        axios
            .post('/api/forgot', {
                email : this.state.email
            })
            .then(response => {
                debugger
                console.log('forgot password response: ')
                alert(response.data.message);
                if (response.status === 200) {
                    this.props.unmountMe();
                }
            }).catch(error => {
                debugger
                alert(error.response.data.message)
                console.log('forgot password error: ')
            })
    }

    render(){
        return (
            <div>
                <form>
                    <div className="">
                        <div className="input-relative">
                            <p className="invalid-input">{this.state.formError["email"]}</p>
                        </div>
                        <div className="">
                            <label className="" htmlFor="username">Enter Email</label>
                        </div>
                        <div className="">
                            <input className="validate" type="email" id="email" name="email" required={true} placeholder=""
                                value={this.state.username} onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            <button className="btn btn-auth col s12" disabled={!this.state.emailValid} onClick={this.handleSubmit} type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Forgot;