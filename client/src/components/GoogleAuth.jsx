import React from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

class GoogleAuth extends React.Component {
  constructor(props) {
    super(props)
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  responseGoogle(res) {
    const event = JSON.stringify(this.props.event);
    function makeApiCall () {
      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
      request.execute(function(resp) {       
        if (resp.id){
          alert("Event was successfully added to the calendar!");
          console.log('Event created: ' + resp.htmlLink);
        } else{
          alert("An error occurred. Please try again later.")
        }
      });
    };
    gapi.client.load('calendar', 'v3', makeApiCall);
  }

  render() {
    return (
      <GoogleLogin
        clientId="122713429777-nbioralfsboud2u8igdcptv3csag3ki2.apps.googleusercontent.com"
        scope="https://www.googleapis.com/auth/calendar"
        discoveryDocs={["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]}
        buttonText="Calendar Authorization"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    )
  }
}

export default GoogleAuth;