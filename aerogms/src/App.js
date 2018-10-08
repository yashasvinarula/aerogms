import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import './App.css';
// components
import Navbar from './components/navbar';
import Signup from './components/signup';
import Login from './components/loginForm';
import Dashboard from './components/dashboard';
import About from './components/about';
import ContactUs from './components/contactUs';
import HomeFooter from './components/footer-home';
import Help from './components/help';
import FAQ from './components/faq';
import Feedback from './components/feedback';
import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      username: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser()
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
        <Navbar />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route path="/login" render={() => <Login updateUser={this.updateUser} />} />
        <Route path="/signup" render={() => <Signup/>} />
        <Route path="/about" render={() =>  <About />} />
        <Route path="/contact" render={() => <ContactUs />} />
        <Route path="/help" render={() => <Help />} />
        <Route path="/faq" render={() => <FAQ />} />
        <Route path="/feedback" render={() => <Feedback />} />
        <HomeFooter />
      </div>
    );
  }
}

export default App;
