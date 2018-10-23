import React, { Component } from 'react';
import '../App.css';

class HomeFooter extends Component {
    render(){
        return(
                <div className="container">   
                    <hr></hr> 
                    <footer className="">
                        <div className="container">
                            <div className="row pos-footer">
                              <div className="col-md-8 offset-md-8"></div>  
                              <div className="col-md-4">
                                <ul className="row">
                                  <li><a className="col-md-4" href="/help">Help</a></li>
                                  <li><a className="col-md-4" href="/faq">FAQ</a></li>
                                  <li><a className="col-md-4" href="/feedback">Feedback</a></li>
                                </ul>
                              </div>
                            </div>
                        </div>
                    </footer>
                </div>
        );
    }
}

export default HomeFooter;