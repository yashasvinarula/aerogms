import React, {Component} from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './css/dashboard.css';
import {history} from './store';
import 'react-bootstrap';
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
import UserDashboard from './components/Dashboard/user-dashboard';
import ProjectView from './components/Project/projectview';

import {connect} from 'react-redux';
import {doLogin, doLogout} from './actions'


class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
      return ( 
        <div className="App">
        <Router history={history}>
        <Switch>
        <Route path="/" exact={true} render={() => <Login doLogin={this.props.doLogin} doLogout={this.props.doLogout} userDetails={this.props.userDetails}/>} />
        <Route path="/dashboard" render={() => <Dashboard doLogout={this.props.doLogout} userDetails={this.props.userDetails} />}  />
        <Route path="/userDashboard" render={() => <UserDashboard doLogout={this.props.doLogout} userDetails={this.props.userDetails} />} />
        <Route path="/login" render={() => <Login doLogin={this.props.doLogin} doLogout={this.props.doLogout} userDetails={this.props.userDetails}/>} />
        <Route path="/forgot" render={() => <Forgot />} />
        <Route path="/reset" render={() => <Reset />} />
        <Route path="/signup" render={() => <Signup/>} />
        <Route path="/about" render={() =>  <About />} /> 
        <Route path="/contact" render={() => <ContactUs />} />
        <Route path="/help" render={() => <Help />} />
        <Route path="/faq" render={() => <FAQ />} />
        <Route path="/feedback" render={() => <Feedback />} />
        <Route path="/usernotactivated" component={() => <div><p>User account is not activated now. Please try again later!</p></div>} />
        <Route path="/projectView" render={()=><ProjectView doLogout={this.props.doLogout} userDetails={this.props.userDetails}/>}/>
        <Route component={() => <div>No Such Page!!</div>} />
        </Switch>
        </Router>
      </div>
      );
  }
}

const mapStateToProps = state =>({userDetails:state.userDetails})
export default  connect(mapStateToProps, {doLogin, doLogout})(App);
//export default App;
