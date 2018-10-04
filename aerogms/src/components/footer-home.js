import React, { Component } from 'react';

class HomeFooter extends Component {
    constructor(){
        super();
    }
    render(){
        return(
                <div>   
                    <hr></hr> 
                    <footer className="">
                        <div className="container">
                            <div className="row">
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