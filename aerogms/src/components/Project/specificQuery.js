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
            chatText : '' // current written text
        }
        this.handleChat = this.handleChat.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({chatText : event.target.value})
    }

    handleChat(event) {
        debugger;
        event.preventDefault();
        if(this.state.chatText === '' || this.state.chatText === 'undefined'  || this.state.chatText === null) {
            alert('Please enter something');
        } else {
            // this.setState({userType : 'user'});
            let newChat = {user : 'user', text : ''};
            newChat.user = this.state.userType;
            newChat.text = this.state.chatText;
            this.setState({chat : [...this.state.chat, newChat], chatText : '', userType : ''});
            document.getElementById('chat-input').value = '';
        }
        return false;
    }

    render() {
        debugger;
        return (
            <div>
                <div id="subject">
                    <label className="inline-display">Subject : </label>
                    <p className="inline-display">This is a complaint</p>
                </div>
                <div className="chat-box">
                    <div className="chat">
                        {
                            this.state.chat.map((chat) => {
                                return (<div><Image src={AdminIcon} /><p>{chat.text}</p></div>);
                            })
                        }
                    </div>
                    {/* <form onSubmit={this.handleChat}> */}
                        <input type="text" id="chat-input" onChange={this.handleChange} placeholder="Enter here" />
                        <Button id="chat-submit-btn" onClick={(event) => this.handleChat(event)} >Send</Button>
                    {/* </form> */}
                </div>
                <div id="comp-box">
                    <div className="descn">
                        <label>Description</label>
                        <p id="descn-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining 
                            essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining 
                            essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                        </p>
                    </div>
                </div>
                <div>
                        <Table striped  className="comp-table">
                            <tbody>
                                <tr><td>AeroId</td><td>1234</td></tr>
                                <tr><td>Comp.Id</td><td>1234</td></tr>
                                <tr><td>Date</td><td>23 Sept, 2018</td></tr>
                                <tr><td>Status</td><td>Pending</td></tr>
                            </tbody>
                        </Table>
                    </div>
            </div>
        );
    }
}

export default SpecificQuery;