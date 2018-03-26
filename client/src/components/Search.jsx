import React from 'react';
import axios from 'axios';
import Dashboard from './Dashboard.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      term: '',
      events: []
    }
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.handleEventJoin = this.handleEventJoin.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  handleTermChange (e) {
    this.setState({term: e.target.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    if(this.state.term.length) {
      this.getEvents(() => {
        this.setState({term: ''});
      });     
    }
  }

  handleKeyPress (e) {
    if(e.key === 'Enter') {
      e.persist();
      this.handleSubmit(e);
    }
  }

  handleEventJoin (event) {
    const eventID = event.eventID;
    const creatorID = event.creatorID;
    const userID = this.props.userID;

    if(this.props.isLogin) {
      if(userID === creatorID) {
        window.alert('You\'ve already been in this event as a creator')
      } 
      else {
        axios.get('/search/userevents', {params: {eventID, userID}})
        .then(response => {
          if(response.data) {
            window.alert('You\'ve already been in this event');
          } else {
            axios.post('/search/userevents/add', {userID, eventID}).then((response) => {
              if(response.data !== 'full') {
                this.props.history.push('/');
              } else {
                window.alert('The event currently is full');
              }             
            })
          }
        })
      }
    } else {
      window.alert('Please log in');
    }
  }

  getEvents (callback) {
    axios.get('/search/events', {params: {term: this.state.term}})
    .then(response => {
      this.setState({events: response.data}, () => {
        this.sortBy();
        if(callback) callback();
      })
    }) 
  }

  reformatDate (str) {
    const date = new Date(str);
    return (date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear() ;
  }

  sortBy (e) {
    const events = this.state.events;
    const key = e? e.target.id : 'startDate';
    events.sort((a, b) => {
      return (a[key] > b[key])? 1 : (a[key] < b[key])? -1 : 0;
    });
    this.setState({events: events});
  }

  render() {
    return (
      <div className="search_container">
        <div className="search">
          <div className="search_bar">
          <span className="search_bar_content">
            <input name="name" value={this.state.term} onChange={(e) => this.handleTermChange(e)} onKeyPress={(e) => this.handleKeyPress(e)} placeholder="category, name, events..."/>
            <button onClick={(e) => this.handleSubmit(e)}>Search</button>
            </span>
          </div>
          <div className="search_events">
            <table className="search_events_results">
            <tbody>
                <tr>
                <th>Event</th>
                <th>Description</th>
                <th><span id="category" onClick={(e) => this.sortBy(e)}>Category</span></th>
                <th><span id="startDate" onClick={(e) => this.sortBy(e)}>Start Date</span></th>
                <th><span id="endDate" onClick={(e) => this.sortBy(e)}>End Date</span></th>
                <th><span id="creatorName" onClick={(e) => this.sortBy(e)}>Creator</span></th>
                <th></th>
                </tr>
                  {this.state.events.map((event, index) => <ListItem key={index} event={event} handleEventJoin={this.handleEventJoin} reformatDate={this.reformatDate}/>)}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const ListItem = (props) => (
  <tr>
    <td>{props.event.eventName}</td>
    <td>{props.event.eventDesc}</td>
    <td>{props.event.category}</td>
    <td>{props.reformatDate(props.event.startDate)}</td>
    <td>{props.reformatDate(props.event.endDate)}</td>
    <td>{props.event.creatorName}</td>
    <td><button onClick={() => props.handleEventJoin(props.event)}>Join</button></td>
  </tr>
)

export default Search