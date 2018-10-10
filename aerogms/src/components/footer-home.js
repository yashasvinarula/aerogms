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
                              <div className="col m8"></div>  
                              <div className="col m4">
                                <ul>
                                  <li><a className="col m4 center footer-elem" href="/help">Help</a></li>
                                  <li><a className="col m4 center footer-elem" href="/faq">FAQ</a></li>
                                  <li><a className="col m4 center footer-elem" href="/feedback">Feedback</a></li>
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