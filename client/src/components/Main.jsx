import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Search from './Search.jsx';
import Profile from './Profile.jsx';
import Homepage from './Homepage.jsx';
import Dashboard from './Dashboard.jsx';
import CreateEvent from './CreateEvent.jsx';
import LoadingScreen from './LoadingScreen.jsx';

const Main = (props) => (
  <div style={{height:'100%'}}>
    <Switch>
      <Route exact path="/" render={() => {
        return props.isLogin ? <Dashboard userData={props.userData} username={props.username} updateConfirmedEvent={props.updateConfirmedEvent}/> 
        : <Homepage />
      }}/>
      <Route path="/search" render={ ({ match, history }) => <Search match={match} history={history} isLogin={props.isLogin} userID={props.userData} username={props.username}/> }/>
      <Route path="/createEvent" render={ ({ match, history }) =>  { 
        return props.isLogin ? <CreateEvent userID={props.userData} match={match} history={history}/> 
        : <Homepage />
      }}/> 
      <Route path="/profile/:id" render={ ({ match, history }) => { 
        return props.isLogin ? <Profile match={match} loggedInUserID={props.userData}/>
        : <Homepage /> 
      }}/>
    </Switch>
  </div>
)

export default Main