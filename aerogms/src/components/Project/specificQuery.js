import React, { Component } from 'react';
import { Table, Button, Image } from 'react-bootstrap/lib';
import '../../css/specific-query.css';
import AdminIcon from '../../images/AdminIcon.png';

class SpecificQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat : [], // conversation 
            userType : '', // admin or user
            chatText : '', // current written text
        }
        this.handleChat = this.handleChat.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        this.setState({chatText : event.target.value})
    }
    handleChat(event) {
        event.preventDefault();
        if(this.state.chatText === '' || this.state.chatText === 'undefined'  || this.state.chatText === null) {
            alert('Please enter something');
        } else {
            let newChat = {user : 'user', text : ''};
            newChat.user = this.state.userType;
            newChat.text = this.state.chatText;
            this.setState({chat : [...this.state.chat, newChat], chatText : '', userType : ''});
            document.getElementById('chat-input').value = '';
        }
        return false;
    }

    render() {
        return (
            <div>
                <div id="subject">
                    <label className="inline-display">Subject : </label>
                    <p className="inline-display">This is a complaint</p>
                    <Button className={`prev-next-btn-default ${this.props.enableNext}`} 
                        onChange={this.handlePrevNext} onClick={this.props.next}
                        disabled={this.props.enableNext == "disable-btn" ? true : false}>Next</Button>
                    <Button className={`prev-next-btn-default ${this.props.enablePrev}`} 
                        onChange={this.handlePrevNext} onClick={this.props.prev} 
                        disabled={this.props.enablePrev == "disable-btn" ? true : false} >Previous</Button>
                </div>
                <div>
                    
                </div>
                <div className="chat-box">
                    <div className="chat">
                        {
                            this.state.chat.map((chat) => {
                                return (<div><Image className="admin-icon" src={AdminIcon} /><p className="chat-text">{chat.text}</p></div>);
                            })
                        }
                    </div>
                    {/* <form onSubmit={this.handleChat}> */}
                        <input type="text" id="chat-input" onChange={this.handleChange} placeholder="Enter here" />
                        <Button id="chat-submit-btn" onClick={(event) => this.handleChat(event)} >Send</Button>
                    {/* </form> */}
                </div>
                {/* <div id="comp-box"> */}
                    <div className="descn">
                        <label>Description</label>
                        <p id="descn-text">{`${this.props.query.description}`}</p>
                    </div>
                {/* </div> */}
                <div>
                    {
                        this.props.query !== 'undefined' ?
                            (
                                <Table striped  className="comp-table">
                                    <tbody>
                                        <tr><td>AeroId</td><td>{`${this.props.query.aero_id}`}</td></tr>
                                        <tr><td>Comp.Id</td><td>{`${this.props.query.query_id}`}</td></tr>
                                        <tr><td>Date</td><td>{`${this.props.query.date}`}</td></tr>
                                        <tr><td>Status</td><td>{`${this.props.query.status}`}</td></tr>
                                    </tbody>
                                </Table>
                            )
                        :
                            ''
                    }
                </div>
            </div>
        );
    }
}

export default SpecificQuery;