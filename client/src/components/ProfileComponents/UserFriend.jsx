import React from 'react';
import { Link } from 'react-router-dom';

export const UserFriend = ({ getUserDisplayedData, friend, handleAddFriend, handleUnfriend, displayedUser }) => {
	return (
		<div className="profile_friend">
       <div className="profile_friend_info_container" >
        <Link className="profile_friend_image" onClick={() => {getUserDisplayedData(friend.userID)}} to={`/profile/${friend.userID}`}>
            <img className="" src={`${friend.profilePic}`} alt=""/>
            <div className="profile_friend_username"><p>{friend.username}</p></div>
        </Link>
        {
          displayedUser ? <button className="btn add_friend_button" type='button' onClick={() => {handleAddFriend(friend.userID)}} > Add Friend </button> :
          <button className="btn add_friend_button" type='button' onClick={() => {handleUnfriend(friend.userID)}} > Remove Friend </button>
        }
        <div className="profile_friend_bio"><p>{friend.bio}</p></div>
        <div className="profile_friend_email">{friend.email}</div>
        <div className="profile_friend_gender">{friend.gender ? `${friend.gender === 'male' ? 'M' : 'F'}` : 'U'}</div>
      </div>
		</div>
	);
}

export default UserFriend;