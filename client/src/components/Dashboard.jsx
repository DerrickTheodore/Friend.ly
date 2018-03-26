import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import Chatroom from './Chatroom.jsx';
import axios from 'axios'
import { GoogleMap, Marker } from "react-google-maps"
import CreateMap from './CreateMap.jsx';
import EditEvent from './EditEvent.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      events : [{roomName: 'Loading...'}],
      select_event_id: 0,
      currentRoom: 0,
      roomName: 'asd',
      location: '',
      locale: '',
      members: [],
      editEvent: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.getMembers = this.getMembers.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.setLocale = this.setLocale.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this); 
    this.confirmEvent = this.confirmEvent.bind(this)
    this.editEvent = this.editEvent.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  
  handleClick (div, item) {
    this.setState( prevState => ({
      currentRoom: item.roomNumber,
      roomName: item.eventName,
      select_event_id: item.item.eventID
    }), () => {
      this.getMembers()
    })
    $('.db_panel_2').css("z-index", "1")
  }
  handleOpen() {
    this.setState({
      editEvent: true
    })
  }
  handleClose() {
    this.setState({
      editEvent: false
    })
  }
  handleAddFriend(friendID) {
    axios.post('/friendship_update', {userID: this.props.userData, friendID, add: 1})
    .then((response) => {
      //...check Network response
    })
    .catch(err => console.log(err));
  }

  getMembers() {
    axios.get('/dashboard/events/members', {params: {eventID: this.state.select_event_id}})
    .then((res) => {
      this.setState({
        members: res.data
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  confirmEvent() { 
    axios.post('/confirmEvent', {userID: this.props.userData, eventID: this.state.select_event_id})
    .then(res => {
      const emails = res.data.emails.map(email => {
        return {'email': email}
      });
      const event = {};
      event.summary = res.data.event.eventName;
      event.location = res.data.event.locationname;
      event.description = res.data.event.eventDesc;
      event.start = {};
      event.start.dateTime = res.data.event.startDate;
      event.start.timeZone = 'America/Los_Angeles';
      event.end = {};
      event.end.dateTime = res.data.event.endDate;
      event.end.timeZone = 'America/Los_Angeles';
      event.attendees = emails;
      event.reminders = {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        };
      this.props.updateConfirmedEvent(event);
      window.alert("Successfully confirmed! Please click Calendar Authorization to add it to calendars of members")
    })
    .catch((err) => {
      console.log(err)
    })
  }

  editEvent(event) {
    axios.post('/editEvent', {userID: this.props.userData, event: event, eventID: this.state.select_event_id})
    .then((res) => {
      this.setState({
        editEvent: false
      })
    })
    .catch((err) => {
      this.setState({
        editEvent: false
      })
    })
  }

  componentWillMount() {
    axios.get('/dashboard/events', {params: {userID: this.props.userData}})
    .then((res) => {
      this.setState({
        events: res.data[0] ? res.data.reverse() : this.state.events,
        select_event_id: res.data[0] ? res.data[0].eventID : 0 
      }, () => {
        this.getMembers()
      });
    })
  }

  handleLocationChange (location) {
    this.setState({
      location: location
    });
  }

  setLocale(locale) {
    this.setState({
      locale: locale
    })
  }

  render () {
    let loggedInUser = this.props.userData;
    return (
      <div className="db_container">
        <div className="dashboard">

          <div className="db_panel_1">
          <div className="db_eventsHeader">
                <span style={{padding:'0', margin:'auto', fontWeight: '400'}}>Events</span>
            </div>
            <div className="db_events">
              <ul>
              {this.state.events.map((item, idx) => idx === this.state.currentRoom ? <EventListItem selected={true} handleClick={this.handleClick} item={item} key={idx} roomNumber={idx}/> : <EventListItem selected={false} handleClick={this.handleClick} item={item} key={idx} roomNumber={idx}/> )}
              </ul>      
            </div>
            <div className="db_create">    
                <h3 style={{margin: "auto"}}>
                <Link to="/createEvent" style={{padding:'0',margin:'auto',color:"#fff"}}>Create Event</Link>
                </h3>
            </div>
          </div>

          <EditEvent showModal={this.state.editEvent} handleClose={() => this.handleClose()} handleSubmit={this.editEvent} event={this.state.events[this.state.currentRoom]}/>

          <Chatroom roomId={this.state.select_event_id} roomName={this.state.events[this.state.currentRoom].eventName} username={this.state.username}/>
          
          <EventDetails handleOpen={this.handleOpen}userID={this.props.userData} members={this.state.members.reduce((arrOfMembers, member) => {
            if(member.userID === loggedInUser) {
              return arrOfMembers;
            }
            return arrOfMembers.concat([member])
          }, [])} currentRoom={this.state.events[this.state.currentRoom]} handleLocationChange={this.handleLocationChange} setLocale={this.setLocale} handleAddFriend={this.handleAddFriend} confirmEvent={this.confirmEvent}/>

      </div>
    </div>
    )
  }
}

const EventListItem = (props) => (
  props.selected ? (<li style={{backgroundColor: 'rgba(136, 136, 136, .25)'}}><div className="eventListItem" onClick={(e) => props.handleClick(e, props)}><div style={{display: 'inline-block', height: '100%', alignItems: 'center'}}><img className="eventListPhoto"height="50px" width="50px"src={props.item.imgLink}/></div><span className="eventListName">{props.item.eventName}</span></div></li>)
  : (<li><div className="eventListItem" onClick={(e) => props.handleClick(e, props)}><div style={{display: 'inline-block', height: '100%', alignItems: 'center'}}><img className="eventListPhoto"height="50px" width="50px"src={props.item.imgLink}/></div><span className="eventListName">{props.item.eventName}</span></div></li>)
)

const EventDetails = (props) => (
  <div className="db_panel_3">
    <div className="db_detail">
    <span className="db_detail_swap" onClick={() => {$('.db_panel_3').css("z-index", "-2"); $('.db_panel_2').css("z-index", "2")}}>Back<hr/></span>
      {props.currentRoom.creatorID === props.userID ? <button onClick={(e) => {e.preventDefault(); props.handleOpen()}}>Edit Event</button> : null }
      {props.currentRoom.creatorID === props.userID ? <button onClick={(e) => {e.preventDefault(); props.confirmEvent()}}>Confirm Event</button> : null }
      <h1>Description:</h1>
      <div className="db_detail_description">{props.currentRoom.eventDesc}</div>
      <h1>Members:</h1>
      <ul className="db_detail_members">
        {props.members.map((member, idx) => 
          (<li 
            key={member.userID}
            onClick={() => {props.handleAddFriend(member.userID)}}
            ><img className="eventListPhoto"height="40px" width="40px"src={member.profilePic}/>{member.username}</li>)
          )}
      </ul>
      <h1>Start Date:</h1>
      <div className="db_detail_startDate">{new Date(props.currentRoom.startDate).toLocaleDateString() + ' ' +  new Date(props.currentRoom.startDate).toLocaleTimeString()}</div>
      <h1>End Date:</h1>
      <div className="db_detail_endDate">{new Date(props.currentRoom.endDate).toLocaleDateString() + ' ' + new Date(props.currentRoom.startDate).toLocaleTimeString()}</div>
      <div className="db_detail_map"><CreateMap geo={props.currentRoom.locationgeo} getEventCoordinate={props.handleLocationChange} setLocale={props.setLocale}/></div>
    </div>
  </div>
)

export default Dashboard