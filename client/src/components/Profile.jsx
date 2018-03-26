import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import UserChart from './ProfileComponents/UserChart.jsx';
import UserFriend from './ProfileComponents/UserFriend.jsx';
import UserEvent from './ProfileComponents/UserEvent.jsx';
import LoggedInUserInfo from './ProfileComponents/LoggedInUserInfo.jsx';
import DisplayedUserInfo from './ProfileComponents/DisplayedUserInfo.jsx';
import FriendRequestList from './ProfileComponents/FriendRequestList.jsx';
import EditEvent from './EditEvent.jsx';
import LoadingScreen from './LoadingScreen.jsx';



class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userDisplayedData: '',
      loggedInUserID: this.props.loggedInUserID,
      toggleFriendRequest: false,
      toggleGraphRequest: false,
      edit: false,
      dashRender: 'active',
      editEvent: false,
      event: ''

    }
    this.getUserDisplayedData = this.getUserDisplayedData.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
    this.handleUnfriend = this.handleUnfriend.bind(this);
    this.handleJoinEvent = this.handleJoinEvent.bind(this);
    this.handleEventDetails = this.handleEventDetails.bind(this);
    this.toggleFriendRequestList = this.toggleFriendRequestList.bind(this);
    this.handleToggleGraph = this.handleToggleGraph.bind(this);
    this.handleProfileDashBoardClick = this.handleProfileDashBoardClick.bind(this);
    this.editEvent = this.editEvent.bind(this);
  }

  //init change edit to true, then when clicked again submit form data to post request
  componentWillUpdate(nextProps, nextState) {
    if(this.state.edit === true && String(nextState.edit) === 'false') {     
      let queryString = $('#profile_form').serialize().replace('%20', '');      
      axios.post(`/profile_form_update?${queryString}`, {userID: this.props.loggedInUserID})
      .then((res) => { 
        this.getUserDisplayedData(this.props.loggedInUserID)
       })
       .catch(err => console.log(err))
    }
  }

  //initial user data call 
  componentWillMount() {
    this.getUserDisplayedData(this.props.match.params.id) 
  }

  //retrieve user data when URL is changed to render friend profile clicked
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.getUserDisplayedData(nextProps.match.params.id)
    } 
  }

  toggleFriendRequestList(e) {
    e.preventDefault()
    this.setState({toggleFriendRequest: !this.state.toggleFriendRequest})
  }

  getUserDisplayedData(user_id) {
    axios.get(`/profile/data/${user_id}`)
    .then((results) => {
      this.setState({userDisplayedData: results.data, loggedInUserID: this.props.loggedInUserID})
    })
    .catch(err => console.log(err))
  }

  handleEditClick(e) {
    e.preventDefault()
    this.setState({edit: !this.state.edit})
  }

  handleProfileDashBoardClick(e) {
      let buttons = ['active', 'closed', 'friends']
      $(`#${e.target.id}`).css({"text-decoration": "underline"}).css({"opacity": "1"})
      buttons.forEach((button) => {
        if(button !== e.target.id) {
          $(`#${button}`).css({"text-decoration": "none"}).css({"opacity": "0.5"})
        }
      })
    this.setState({dashRender: `${e.target.id}`})
  }

  handleAddFriend(friendID) {
    axios.post('/friendship_update', {userID: this.props.loggedInUserID, friendID, add: 1})
    .then((response) => {
      //...check Network response
    })
    .catch(err => console.log(err));
  }

  handleUnfriend(friendID) {
    axios.post('/friendship_update', {userID: this.props.loggedInUserID, friendID, add: 0})
    .then((response) => {
      //...check Network response
    })
    .catch(err => console.log(err));
  }

  handleJoinEvent(eventID) {
    axios.post('/event_attendance_update', {userID: this.props.loggedInUserID, eventID})
    .then((response) => {
      //...check Network response
    })
    .catch(err => console.log(err));
  }

  handleEventDetails(event) {
    this.setState({event: event}, () => {
      this.handleOpen()
    })
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

  confirmEvent() { 
    axios.post('/confirmEvent', {userID: this.props.loggedInUserID, eventID: event.eventID})
    .then((res) => {

    })
    .catch((err) => {

    })
  }

  editEvent(event) {
    axios.post('/editEvent', {userID: this.props.loggedInUserID, event: event, eventID: this.state.event.eventID})
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

  handleToggleGraph() {
    this.setState({toggleGraph: !this.state.toggleGraph}, () => {
      this.setState({toggleGraphRequest: !this.state.toggleGraphRequest})
    })
  }

  render() {
      if(!this.state.userDisplayedData) {
        return(
          <div className="profile_container">
            <img className="profile_loading" src="https://hiretual.com/assets/img/loading.gif" alt=""/>
          </div> 
        ) 
      } else {
      return (
        <div className="profile_container">
          <div className="profile">
            <div className="profile_data">
              {(this.props.match.params.id == this.props.loggedInUserID) ? 
              this.state.toggleFriendRequest ? <FriendRequestList 
              fetchedFriendRequest={this.state.userDisplayedData.allPendingFriendRequest} 
              handleAddFriend={this.handleAddFriend}
              handleUnfriend={this.handleUnfriend} 
              getUserDisplayedData={this.getUserDisplayedData}
              /> : <UserChart categories={this.state.userDisplayedData.categories} toggleGraph={this.state.toggleGraphRequest}/> : <UserChart categories={this.state.userDisplayedData.categories} toggleGraph={this.state.toggleGraphRequest}/>}
            </div>
            {
              (this.props.match.params.id == this.props.loggedInUserID) ? <LoggedInUserInfo toggleFriendRequest={this.state.toggleFriendRequest}
              userDisplayedData={this.state.userDisplayedData} toggleFriendRequestList={this.toggleFriendRequestList} handleEditClick={this.handleEditClick} edit={this.state.edit} handleToggleGraph={this.handleToggleGraph} toggleGraphRequest={this.state.toggleGraphRequest}/> : <DisplayedUserInfo handleToggleGraph={this.handleToggleGraph} userDisplayedData={this.state.userDisplayedData} toggleGraphRequest={this.state.toggleGraphRequest} handleToggleGraph={this.handleToggleGraph}/>
            }
            <div className="profile_dashboard">
              <div className="profile_dashboard_nav">
                <span onClick={(e) => {this.handleProfileDashBoardClick(e)}} id="active">Active Events</span>
                <span onClick={(e) => {this.handleProfileDashBoardClick(e)}}  id="closed">Closed Events</span>
                <span onClick={(e) => {this.handleProfileDashBoardClick(e)}}  id="friends">Friends</span>
              </div>
              {
                this.state.dashRender === 'active' ?
                  <div className="profile_events">
                    <div className="profile_events_container">
                      {
                        (this.props.match.params.id == this.props.loggedInUserID) ? !!this.state.userDisplayedData.events.length && this.state.userDisplayedData.events.reduce((activeEvents, event) => {
                          if(event.status === 'active'){ 
                            return activeEvents.concat([<UserEvent displayedUser={null} loggedInUserID={this.props.loggedInUserID} key={event.eventID} event={event} handleEventDetails={this.handleEventDetails}/>])
                          }
                          return activeEvents;
                        }, []) : 
                        !!this.state.userDisplayedData.events.length && this.state.userDisplayedData.events.reduce((activeEvents, event) => { 
                          if(event.status === 'active'){  
                            return activeEvents.concat([<UserEvent displayedUser={this.props.match.params.id} loggedInUserID={this.props.loggedInUserID} key={event.eventID} event={event} handleJoinEvent={this.handleJoinEvent} />])
                          }
                          return activeEvents;
                        }, [])
                      }
                    </div>
                  </div>
                : this.state.dashRender === 'closed' ?
                  <div className="profile_events">
                    <div className="profile_events_container">
                      {
                        (this.props.match.params.id == this.props.loggedInUserID) ? !!this.state.userDisplayedData.events.length && this.state.userDisplayedData.events.reduce((closedEvents, event) => {
                          if(event.status === 'closed'){  
                            return closedEvents.concat([<UserEvent displayedUser={null} loggedInUserID={this.props.loggedInUserID} key={event.eventID} event={event} handleJoinEvent={this.handleJoinEvent} handleOpen={this.handleOpen}/>])
                          }
                          return closedEvents;
                        }, []) : 
                        !!this.state.userDisplayedData.events.length && this.state.userDisplayedData.events.reduce((closedEvents, event) => { 
                          if(event.status === 'closed'){  
                            return closedEvents.concat([<UserEvent displayedUser={this.props.match.params.id} loggedInUserID={this.props.loggedInUserID} key={event.eventID} event={event} handleJoinEvent={this.handleJoinEvent} handleOpen={this.handleOpen}/>])
                          }
                          return closedEvents;
                        }, [])
                      }
                    </div>
                  </div>
                : <div className="profile_friends">
                    <div className="profile_friends_container">
                      {
                        (this.props.match.params.id == this.props.loggedInUserID) ? !!this.state.userDisplayedData.friends.length && this.state.userDisplayedData.friends.map(friend => <UserFriend  displayedUser={null} loggedInUserID={this.props.loggedInUserID} key={friend.userID} friend={friend} handleAddFriend={this.handleAddFriend} handleUnfriend={this.handleUnfriend} />) : 
                        !!this.state.userDisplayedData.friends.length && this.state.userDisplayedData.friends.map(friend => <UserFriend  displayedUser={this.props.match.params.id} loggedInUserID={this.props.loggedInUserID} key={friend.userID} friend={friend} handleAddFriend={this.handleAddFriend} handleUnfriend={this.handleUnfriend}/>)
                      }
                    </div>
                  </div>
              }
            </div>        
          </div> 
          <EditEvent showModal={this.state.editEvent} handleClose={() => this.handleClose()} handleSubmit={this.editEvent} event={this.state.event} /> 
        </div>
      );
    }
  }
}

export default Profile;

