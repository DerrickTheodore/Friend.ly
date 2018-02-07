import React from 'react';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import $ from 'jquery';
// import { CloudinaryContext, Image, Transformation, Video } from 'cloudinary-react';
import { cloudinary_API, cloudinary_SECRET, cloudinary_cloud_name, cloudinary_cloud_upload_presets } from '../../../../config.js';
import FormData from 'form-data';
// import cloudinary from 'cloudinary-core';

const sha1Encrypt = require('sha1');
// const cloudinaryCore = new cloudinary.Cloudinary({
//     cloud_name,
//     api_key: cloudinary_API,
//     api_secret: cloudinary_SECRET,
//     upload_preset,
// });



export class UserChart extends React.Component {
  constructor(props) {
    super(props)
    this.makeGraph.bind(this);
  }

  componentDidMount() {
    this.makeGraph();
  }

  makeGraph(){
    var chart = AmCharts.makeChart( "chartdiv", {
      "theme": "light",
      "type": "serial",
      "startDuration": 2,
      "dataProvider": [{
          "category": "Movies",
          "attended": 5,
          "color": "#FF0F00"
      }, {
          "category": "Outdoors",
          "attended": 2,
          "color": "#FF6600"
      }, {
          "category": "Food/Dining",
          "attended": 9,
          "color": "#FF9E01"
      }, {
          "category": "Live Music",
          "attended": 2,
          "color": "#FCD202"
      }, {
          "category": "Exercise",
          "attended": 2,
          "color": "#F8FF01"
      }, {
          "category": "Gaming",
          "attended": 4,
          "color": "#B0DE09"
      }, {
          "category": "Drinks",
          "attended": 4,
          "color": "#04D215"
      }, {
          "category": "Arts & Culture",
          "attended": 8,
          "color": "#04D215"
	    }],
      "valueAxes": [{
          "position": "left",
          "axisAlpha":0,
          "gridAlpha":0
      }],
      "graphs": [{
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "colorField": "color",
          "fillAlphas": 0.85,
          "lineAlpha": 0.1,
          "type": "column",
          "topRadius":1,
          "valueField": "attended"
      }],
      "depth3D": 40,
    "angle": 30,
      "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
      },
      "categoryField": "category",
      "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha":0,
          "gridAlpha":0
    
      },
      "export": {
        "enabled": true
       }
    
    }, 0);
    console.log(chart);
  }

  render() {
    return(
      <div id="chartdiv"> </div>
    )
  }
}

export const UserFriend = (props) => {
	return (
			<div className="profile_friend">
			<Link onClick={() => {props. getUserDisplayedData(props.friend.userID)}} to={`/profile/${props.friend.userID}`}>
					<img className="" src="https://images.onlinelabels.com/images/clip-art/dagobert83/dagobert83_female_user_icon.png" alt=""/>
			</Link>
      <div classname="profile_friend_info" >
        <p className="profile_friend_username">{props.friend.username}</p>
        <p className="profile_friend_email">{props.friend.email}</p>
        <p className="profile_friend_gender">{props.friend.gender}</p>
        <p className="profile_friend_bio">{props.friend.bio}</p>
      </div>
        <button onClick={() => {props.handleAddFriend(props.friend.userID)}} > Add Friend </button>
			</div>
	);
}

export const UserEvent = (props) => {
  return (
    <div className="profile_event">
      <img src={`${props.event.imgLink}`} />
      <div classname="profile_event_info" >
        <p className="profile_event_name">{props.event.eventName}</p>
        <p className="profile_event_status">{props.event.status}</p>
        <p className="profile_event_creator">{props.event.creatorID}</p>
        <p className="profile_event_date_range">{props.event.startDate} - {props.event.endDate}</p> 
        <p className="profile_event_category">{props.event.category}</p>
        <p className="profile_event_description">{props.event.eventDesc}</p>
      </div>
        <button onClick={() => {props.handleJoinEvent(props.event.eventID)}} > Join Event </button>  
    </div>
  );
}

export class ImageEditIcon extends React.Component {
	constructor(props) {
    super(props)
    this.handleDrop.bind(this);
	}
    // get's called from react dropzone when file is dropped
    handleDrop (files){
      // Push all the axios request promise into a single array
      const image = files[0];
      // Initial FormData
      this.props
      const formData = new FormData();
      formData.append("file", image);
      formData.append('public_id', `${this.props.loggedInUserID}`);
      formData.append("tags", `Friend.ly, profile picture`);
      formData.append("upload_preset", cloudinary_cloud_upload_presets); // Replace the preset name with your own
      formData.append("api_key", cloudinary_API); // Replace API key with your own Cloudinary key
      formData.append("timestamp", (Date.now() / 1000) | 0);
      
      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios.post("https://api.cloudinary.com/v1_1/codeinfuse/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
        const data = response.data;
        const fileURL = data.secure_url // You should store this URL for future references in your app
        console.log(data);
      })
    }
	render() {
		return (
      <Dropzone 
        loggedInUserID={this.props.loggedInUserID}
        onDrop={this.handleDrop}
        style={{gridColumn: "1 / 2", gridRow: "1 / 2"}} 
      >
        <img style={{width: "100%", height: "auto"}} src="http://www.iconninja.com/files/9/26/395/instagram-insta-photo-social-media-camera-icon.svg" alt=""/>
      </Dropzone >
		)
	}
}


export const UserUpdateForm = (props) => {
  return (
    <div>
      <form id="profile_form" action={`/profile_update/${props.loggedInUserID}`} method="POST">
        <label for="POST-bio">Bio:</label>
        <textarea name="bio" id="" cols="30" rows="10" placeholder="">
        </textarea>
        <label for="POST-username">Username:</label> <input id="POST-username" type="text" name="username"/>
        <hr/>
        <label for="POST-email">e-mail:</label> <input id="POST-email" type="text" name="email"/>
        <fieldset>
          <legend>Gender</legend>
          <input type="radio" id="genderChoice1"
            name="gender" value="M"/>
          <label for="genderChoice1">Male</label>
          <input type="radio" id="genderChoice2"
            name="gender" value="F"/>
          <label for="genderChoice2">Female</label>
          <input type="submit" value=""/>
        </fieldset>
      </form>
    </div>
  );
}
