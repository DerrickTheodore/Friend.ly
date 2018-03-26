import React from 'react';

export const UserUpdateForm = ({ userDisplayedData }) => {
  return (
      <div className="profile_form"> 
        <form id="profile_form" action="" method="">
          <div className="row">
            <label className="col_25">Bio:</label> <textarea name="bio" id="POST-textarea" col={30} row={30} placeholder={`${userDisplayedData.bio}`}></textarea>
          </div>
            
          <div className="row">  
            <label className="col_25">Username:</label> <input id="POST-username" type="text" name="username" placeholder={`${userDisplayedData.username}`}/>
          </div>

          <div className="row">
            <label className="col_25">e-mail:</label> <input id="POST-email" type="text" name="email" placeholder={`${userDisplayedData.email}`}/>
          </div>

          <div className="row">
            <fieldset className="col_25">              
              <label>Male</label>
              <input type="radio" name="gender" value="male"/>
        
              <label>Female</label>
              <input type="radio" name="gender" value="female"/>
              
              <button type="submit" value=""/>
            </fieldset>
          </div>
        </form>
      </div>
  );
}
export default UserUpdateForm;