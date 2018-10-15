import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import './App.css';
// components

import Signup from './components/signup';
import Login from './components/login';
import Forgot from './components/forgot';
import Reset from './components/reset';
import Dashboard from './components/Dashboard/dashboard';
import About from './components/about';
import ContactUs from './components/contactUs';
import Help from './components/help';
import FAQ from './components/faq';
import Feedback from './components/feedback';

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      username: null,
      email:null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
   // this.getUser()
  }

  updateUser (userObject) {
    this.setState(userObject)
  }

  getUser() {
    axios.get('/user/').then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  render() {
    return (
      <div className="App">
        {/* Routes to different components */}
        <Route path="/" exact={true} render={() => <Dashboard loggedIn={this.state.loggedIn} username={this.state.username} />}  />
        <Route path="/dashboard" render={() => <Dashboard loggedIn={this.state.loggedIn} username={this.state.username}/>}  />
        <Route path="/login" render={() => <Login updateUser={this.updateUser} />} />
        <Route path="/forgot" render={() => <Forgot />} />
        <Route path="/reset" render={() => <Reset />} />
        <Route path="/signup" render={() => <Signup/>} />
        <Route path="/about" render={() =>  <About />} />
        <Route path="/contact" render={() => <ContactUs />} />
        <Route path="/help" render={() => <Help />} />
        <Route path="/faq" render={() => <FAQ />} />
        <Route path="/feedback" render={() => <Feedback />} />
        <Route component={() => <div>No Such Page!!</div>} />
      </div>
    );
  }
}

export default App;
