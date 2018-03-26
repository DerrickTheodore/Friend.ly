import React from 'react';
import { Link } from 'react-router-dom';

class FriendRequestList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requestClicked: false
    }
  }

  render(){
    return (
      <div className="friend_request_list">
          {this.props.fetchedFriendRequest.map((request) => {
            return <FriendRequestListItem 
              key={request[1].friendID}
              ID={request[1].friendID}
              requestObj={Object.assign(request[1], request[2])}
              handleAddFriend={this.props.handleAddFriend}
              handleUnfriend={this.props.handleUnfriend}
              getUserDisplayedData={this.props.getUserDisplayedData}
            />
          })}
      </div>
    )
  }
}

export const FriendRequestListItem = ({ ID, requestObj, handleAddFriend, handleUnfriend , getUserDisplayedData }) => {
  return (
    <div className="friend_request_listitem">
    	{
        requestObj.access ? 
        <Link className="friend_request_image" onClick={() => {getUserDisplayedData(ID)}} to={`/profile/${ID}`}>
          <img src={`${requestObj.profilePic}`} alt=""/>
        </Link> :
        <span className="friend_request_image" >  
          <img src={`${requestObj.profilePic}`} alt=""/>
        </span>  
      }  
        <span className="friend_request_username">{requestObj.username}</span>
      {
        requestObj.access ? 
        <button onClick={() => {handleAddFriend(ID)}}>Accept</button> :
        <button onClick={() => {handleUnfriend(ID)}}>Withdraw request</button>
      }
    </div>
  );
}

export default FriendRequestList;