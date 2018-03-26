import React from 'react';
import axios from 'axios';
import 'react-dates/initialize'; 
import { DateRangePicker, DayPickerRangeController } from 'react-dates';
import {
  Form,
  StyledText,
  StyledTextArea,
  StyledRadio,
  StyledRadioGroup,
  StyledSelect,
  StyledCheckbox
} from 'react-form';
import CreateMap from './CreateMap.jsx';

let pubKey = 'BPiwireF6caAoVpDjfv49II350Ad-JnZpC-1M4F5jV1RkXrowLEn0YikrSwUIVB83cf465FKw8rIFVoeusM8ewQ';

let categories = [ //Categories that the user can choose when creating an event
  {
    label: 'Movies',
    value: 'movies'
  },
  {
    label: 'Outdoors',
    value: 'outdoors'
  },
  {
    label: 'Food/Dining',
    value: 'food'
  },
  {
    label: 'Live Music',
    value: 'music'
  },
  {
    label: 'Exercise',
    value: 'exercise'
  },
  {
    label: 'Gaming',
    value: 'gaming'
  },
  {
    label: 'Drinks',
    value: 'drinks'
  },
  {
    label: 'Arts & Culture',
    value: 'arts'
  }
]

let capacity = [
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: '6',
    value: '6'
  }
]

class CreateEvent extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      submittedValues: {},
      locale: '',
      location: ''
    }
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.setLocale = this.setLocale.bind(this);
    this.askPermission = this.askPermission.bind(this);
    this.sendSubscriptionToServer = this.sendSubscriptionToServer.bind(this);
    this.subscribeUser = this.subscribeUser.bind(this);
  }

//Function to convert public key to U int 8 Array format

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

//Send push notification subscription details to server, where the user details will be saved
//to "endpoint" and "auth" fields in the user table
  sendSubscriptionToServer(endpoint, key, auth) {
    let encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
    let encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
    axios.post('/subscribeNotifs', {
      publicKey: encodedKey,
      auth: encodedAuth,
      notificationEndPoint: endpoint,
      id: this.props.userID
    }).then((res) => console.log(JSON.stringify(res)))
  }

//After service worker is ready and user permissions notifications, get unique data from the
//push notification subscription and pass it to the sendSubscriptionToServer function
  subscribeUser() {
    navigator.serviceWorker.ready.then((reg) => {
    let subscribeParams = {userVisibleOnly: true};
    //Setting the public key of our VAPID key pair.
    let applicationServerKey = this.urlB64ToUint8Array(pubKey);
    subscribeParams.applicationServerKey = applicationServerKey;
    reg.pushManager.subscribe(subscribeParams)
        .then((subscription) => {
            // Update status to subscribe current user on server, and to let
            // other users know this user has subscribed
            let endpoint = subscription.endpoint;
            let key = subscription.getKey('p256dh');
            let auth = subscription.getKey('auth');
            this.sendSubscriptionToServer(endpoint, key, auth);
        })
        .catch((err) => {
            // A problem occurred with the subscription.
            console.log('Unable to subscribe to push.', err);
        });
    });

  }
//Function which asks user for permission to subscribe their browser to push notifs for Friend.ly
 askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then( (permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    } else {
      this.subscribeUser()
    }
  });
}

  componentWillMount() {
    this.askPermission()
  }
// These two functions are passed down to the Google Maps component to reset map orientation on location change
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

  render() {
    return(
      <div className="event_container">
        <div className="event_create">
          <Form
            onSubmit={submittedValues => this.setState({submittedValues: submittedValues}, () => {
              axios.post('/createEvent', {
              eventName: this.state.submittedValues.eventName,
              eventDesc: this.state.submittedValues.eventDesc,
              capacity: this.state.submittedValues.capacity,
              category: this.state.submittedValues.category,
              creatorID: this.props.userID,
              startDate: this.state.startDate,
              endDate: this.state.endDate,
              locationName: this.state.locale,
              locationGeo: this.state.location
              }).then(response => {
                this.props.history.push('/');
              })})
            }>
            { formApi => (
              <form onSubmit={formApi.submitForm} id="form2">
                <StyledText field="eventName" id="eventName" placeholder="Event Name"/>
                <br/>
                <StyledTextArea field="eventDesc" id="eventDesc" placeholder="Description..." style={{width: '60%', height: '20%', fontSize: '24px'}}/>
                <br/>
                <StyledSelect field="capacity" id="capacity" options={capacity} placeholder="Capacity" style={{fontSize: '24px'}}/>
                <br/>
                <StyledSelect field="category" id="category" options={categories} placeholder="Category" style={{fontSize: '24px'}}/>
                <br/>
                <StyledCheckbox field="authorize" id="authorize" label="Authorize" className="d-inline-block" style={{fontSize: '24px', color: '#fff'}}/>
                <DateRangePicker
                  startDate={this.state.startDate} 
                  startDateId="your_unique_start_date_id" 
                  endDate={this.state.endDate} 
                  endDateId="your_unique_end_date_id" 
                  onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} 
                  focusedInput={this.state.focusedInput} 
                  onFocusChange={focusedInput => this.setState({ focusedInput })} 
                />
                <br/>
                <button type="submit" className="mb-4 btn btn-primary" style={{padding: '2px', height:'10%', width: '10%'}}>Submit</button>
              </form>
            )}
          </Form>
          <CreateMap geo={this.state.location} getEventCoordinate={this.handleLocationChange} setLocale={this.setLocale}/>
        </div>
      </div>
      )
  }
}

export default CreateEvent