import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery'

export class UserEvent extends React.Component{
  constructor(props){
    super(props)
    this.event = this.props.event; 
    this.handleJoinEvent = this.props.handleJoinEvent; 
    this.handleEventDetails =  this.props.handleEventDetails; 
    this.displayedUser = this.props.displayedUser; 
    this.loggedInUserID = this.props.loggedInUserID; 
    this.color = '';
  }

  toDateFormat(dateStr){
    let dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString();
  }
  
componentWillMount() {
  ((category) => {
    const COLORS = {
      arts: '#027bc4',
      drinks: '#e27b3d',
      gaming: '#76b0a0',
      exercise: '#26b7d3',
      music: '#e44948',
      food: '#fec057',
      outdoors: '#93a73d',
      movies: '#324d5b'
    }
    this.color = `${COLORS[`${category}`]}`
  })(this.event.category)
}
  render() {
    return (
      <div className="profile_event">
        <div className="profile_event_info" >
          <img src={`${this.event.imgLink}`} />
          {
            !this.displayedUser ? this.loggedInUserID == this.event.creatorID ? <button className="btn event_details_button" type='button' onClick={() => { this.handleEventDetails(event) }} > Event Details </button> :
            <input type="text" style={{display: "none"}}/> :
            <button className="btn join_event_button" type='button' onClick={() => {this.handleJoinEvent(this.event.eventID)}} > Join Event </button>
          }
          <span className="profile_event_name" style={{backgroundColor: `${this.color}`}}><span>{this.event.eventName}</span></span>
          <span className="profile_event_creator">{this.event.creatorName}</span>
          <span className="profile_event_date_range">{this.toDateFormat(this.event.startDate)} - {this.toDateFormat(this.event.endDate)}</span> 
          <span className="profile_event_capacity">{this.event.current} out of {this.event.capacity}</span>
          <span className="profile_event_location">{this.event.locationname || 'undecided'}</span>
          <div className="profile_event_description"><p>{this.event.eventDesc}</p></div>
        </div>   
      </div>
    );
  }
}

export default UserEvent;