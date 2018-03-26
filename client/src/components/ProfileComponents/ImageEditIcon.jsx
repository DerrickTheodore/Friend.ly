import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import FormData from 'form-data';

export class ImageEditIcon extends React.Component {
	constructor(props) {
    super(props)
    this.handleDrop.bind(this);
  }
  
  handleDrop (files, loggedInUserID){
    const image = files[0];
    const url = `/profile_img_update`;
    //module to populate forms {replaces form HTML}
    const formData = new FormData();
    //file is a attr on form element, and second parameter is it's value
    formData.append('file', image)

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      },
      params: {
        userID: loggedInUserID
      }
    }

    return axios.post(url, formData, config)
  }

	render() {
    let loggedInUserID = this.props.loggedInUserID;
		return (
      <Dropzone 
        onDrop={(files) => {this.handleDrop(files, loggedInUserID)}}
        className="profile_dropzone"
      >
      <img src="http://www.iconninja.com/files/9/26/395/instagram-insta-photo-social-media-camera-icon.svg" alt=""/>
      </Dropzone >
		)
	}
}

export default ImageEditIcon;