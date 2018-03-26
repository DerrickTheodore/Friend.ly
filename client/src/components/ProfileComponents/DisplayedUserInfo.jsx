import React from 'react';

export const DisplayedUserInfo = ({ userDisplayedData, handleToggleGraph, toggleGraphRequest }) => {
  return (
    <div className="profile_info_container" >
      <div className="profile_image">
        <img src={`${userDisplayedData.profilePic}`} />
        <div className="profile_username">{userDisplayedData.username}</div> 
      </div>
        <div className="profile_info">
          <div className="profile_bio">
            <p>{userDisplayedData.bio}</p>
          </div>  
            <div className="profile_gender" >{userDisplayedData.gender ? `${userDisplayedData.gender === 'male' ? 'M' : 'F'}` : 'U'}</div>
            <div className="profile_email" >{userDisplayedData.email}</div>
            <div className="profile_social_media">
              {
                userDisplayedData.facebookID ? <div className="profile_social_media_icon"> <a href={`${userDisplayedData.facebookLoginPage}`}> <img src="https://www.seeklogo.net/wp-content/uploads/2016/09/facebook-icon-preview-400x400.png" alt=""/> </a> </div> :
                <div className="profile_social_media_icon"> </div>
              }
            </div> 
        </div>
        <div className="profile_action_buttons">
          <div className="profile_graph">
            <button className="btn profile_graph_button" onClick={handleToggleGraph}> {toggleGraphRequest ? "Bar Graph" : "Pie Graph"} </button>
          </div>
        </div>  
    </div>  
  )
}

export default DisplayedUserInfo;