import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './css/dashboard.css';
import history from './history';
// components
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

import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
import {doLogin, doLogout} from './actions'

const App = ({userDetails, doLogin, doLogout}) =>(
      <div className="App">
      <Router history={history}>        
        <Switch>
        <Route path="/" exact={true} render={() => <div><h1>Coming soon...</h1></div>}  />
        <Route path="/dashboard" render={() => <Dashboard doLogout={doLogout} userDetails={userDetails} />}  />
        <Route path="/login" render={(props) => <Login doLogin={doLogin} userDetails={userDetails} {...props}/>} />
        <Route path="/forgot" render={() => <Forgot />} />
        <Route path="/reset" render={() => <Reset />} />
        <Route path="/signup" render={() => <Signup/>} />
        <Route path="/about" render={() =>  <About />} />
        <Route path="/contact" render={() => <ContactUs />} />
        <Route path="/help" render={() => <Help />} />
        <Route path="/faq" render={() => <FAQ />} />
        <Route path="/feedback" render={() => <Feedback />} />
        <Route component={() => <div>No Such Page!!</div>} />
        </Switch>
      </Router>
      </div>
);

// function mapDispatchToProps(dispatch){
//   return bindActionCreators({doLogin}, dispatch);
// }

const mapStateToProps = state =>({userDetails:state.userDetails})
export default connect(mapStateToProps, {doLogin, doLogout})(App);
