import React from 'react';
import ImageEditIcon from './ImageEditIcon.jsx';
import UserUpdateForm from './UserUpdateForm.jsx';

export const LoggedInUserInfo = ({ userDisplayedData, edit, handleEditClick, toggleFriendRequestList, toggleFriendRequest, handleToggleGraph, toggleGraphRequest }) => {
  return (
    <div className="profile_info_container">
      <div className="profile_image">
      {
        edit ? <ImageEditIcon loggedInUserID={userDisplayedData.userID}/> : <img src={`${userDisplayedData.profilePic}`} />
      }
      </div>
      <span className="profile_username">{userDisplayedData.username}</span>
      {
      edit ? <UserUpdateForm userDisplayedData={userDisplayedData}/>
      :
        <div className="profile_info">
          <div className="profile_bio">
            <p>{userDisplayedData.bio}</p>
          </div>
            <div className="profile_gender">{userDisplayedData.gender ? `${userDisplayedData.gender === 'male' ? 'M' : 'F'}` : 'U'}</div>
            <div className="profile_email">{userDisplayedData.email}</div>
            <div className="profile_social_media">
              {
                userDisplayedData.facebookID ? <div className="profile_social_media_icon"> <a href={`${userDisplayedData.facebookLoginPage}`}> <img src="https://www.seeklogo.net/wp-content/uploads/2016/09/facebook-icon-preview-400x400.png" alt=""/> </a> </div> :
                <div className="profile_social_media_icon"> </div>
              }
            </div>  
        </div>  
      }
        <div className="profile_action_buttons">
          <div className="profile_edit">
            <button className="btn profile_edit_button" onClick={handleEditClick}> {edit ? "Save" : "Edit Profile"} </button>
          </div>
          <div className="profile_queue">
            <button className="btn profile_queue_button" onClick={toggleFriendRequestList}> {toggleFriendRequest ? "Categories" : "Friend Request"} </button>
          </div>
          <div className="profile_graph">
            <button className="btn profile_graph_button" onClick={handleToggleGraph}> {toggleGraphRequest ? "Bar Graph" : "Pie Graph"} </button>
          </div>
        </div>  
    </div>  
  )
}

export default LoggedInUserInfo;