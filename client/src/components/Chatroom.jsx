import React from 'react';
import $ from 'jquery';
import { roomsRef, rootRef, timestamp } from '../index.jsx';
class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      messages: [],
      ref: roomsRef.child('0').child('/messages/'),
      temp: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNewMessage = this.handleNewMessage.bind(this)
    this.temp = null
  }

  // This component should have access to the currently logged in user, and the currentRoom passed down as props. We will then use the current room 
  // ID to communicate with the firebase server. 
  componentWillReceiveProps(nextProps) {
    this.state.ref.off()
    this.setState(previousState => ({
      messages: [],
      ref: roomsRef.child(nextProps.roomId).child('/messages/'),
      roomId: nextProps.roomId
    }), () => {   
    this.state.ref.on('child_added', 
      snapshot => {
        if(this.state.temp === 1) {
        this.handleNewMessage(snapshot.val(), snapshot.key)
        }
    });
    })
  }

  componentDidMount() {
    $('.db_typingText').on('keypress', (e) => {
      return null
    })
    $('.db_typingText').html('Type a message...')
    $('.db_typingText').on('focus', () => {
      let text = $('.db_typingText').html()
      if (text === 'Type a message...') {
        $('.db_typingText').html('')
      }
    })
    $('.db_typingText').on('keyup', () => {
      let text = $('.db_typingText').text()
      this.setState({
        input: text
      })
    })
    $('.db_typingText').on('focusout', () => {
      let text = $('.db_typingText').html()
      if (!text.length) {
        $('.db_typingText').html('Type a message...')
      }
    })
    $('.db_chatroom').scrollTop($('.db_chatroom')[0].scrollHeight)
    $('.db_typingText').on('keypress', (e) => {
      let shift = e.shiftKey
      if (!shift && e.keyCode == 13) {
        e.preventDefault()
        this.handleSubmit()
      }
    })
    this.setState({
      temp: 1
    })
  }

  handleSubmit() {
    if (this.state.input.length) {
      this.state.ref.push({
        username: this.props.username,
        message: this.state.input,
        timestamp: timestamp
      })
    this.setState({
      input: ''
    }, () => {
      $('.db_chatroom').scrollTop($('.db_chatroom')[0].scrollHeight)
    })
     $('.db_typingText').html('')  
    }
  }

  handleNewMessage (newMessage, key) {
    newMessage.createdAt = new Date(newMessage.timestamp).toLocaleTimeString();
    newMessage.key = key;
    this.setState(prevState => ({
      messages: [...prevState.messages, newMessage]
    }), () => {
      $('.db_chatroom').scrollTop($('.db_chatroom')[0].scrollHeight)
    })
  }

  handleChatSwap() {
    $('.db_panel_2').css("z-index", "-1")
  }

  handleInfoSwap() {
    $('.db_panel_2').css("z-index", "-1")
    $('.db_panel_3').css("z-index", "2")
  }

  render() {
    return (<div className="db_panel_2" key={2}>
            <div className="db_info">
              <span className="db_chat_swap" onClick={ () => {this.handleChatSwap()}}>Events</span>
              <span style={{padding:'0', margin:'auto'}}>{this.props.roomName}</span>
              <span className="db_info_swap" onClick={() => {this.handleInfoSwap()}}>Details</span>
            </div>
            <div className="db_chatroom">
              <h3>{'This is the beginning of your chat history with ' + this.props.roomName }</h3>
              <ul style={{listStyle: 'none', margin: '10px', paddingLeft:'0', fontSize: '16px'}}>
                {this.state.messages.map((item, idx) => {
                  return <ChatroomMessage sentByUser={item.username === this.props.username} message={item} key={idx}/>
                })}
              </ul>
            </div>
            <div className="db_typing">
              <span className="db_typingText" contentEditable='true'></span><button className="db_chatSend" onClick={() => {this.handleSubmit()}}>Send</button>
            </div>
          </div>)
  }
}

const ChatroomMessage = (props) => (
  props.sentByUser ? <li style={{textAlign:'right', marginBottom:'10px', width:'100%'}}><span style={{color: '#fff',backgroundColor: 'rgba(0, 132, 255, 1)', borderRadius: '1em', whiteSpace: 'pre-wrap', padding:'10px', display: 'inline-block', wordBreak: 'break-word', maxWidth:'50%'}}>{ '' + props.message.message}</span></li> 
  : <li style={{textAlign:'left', marginBottom:'10px', width:'auto', maxWidth: '80%'}}><div>{props.message.username}</div><span style={{backgroundColor: '#eee', borderRadius: '1em', whiteSpace: 'pre-wrap', padding:'10px', display: 'inline-block', wordBreak: 'break-all'}}><div>{props.message.message}</div></span><span style={{fontSize: '.8em'}}>{props.message.createdAt}</span></li>
)

export default Chatroom