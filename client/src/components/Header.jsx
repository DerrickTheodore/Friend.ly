import React from 'react';
import {Link} from 'react-router-dom';
import ReactModalLogin from 'react-modal-login';
import axios from 'axios';
import GoogleAuth from './GoogleAuth.jsx';


class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      loading: false,
      error: null,
      redirect: false
    };
    this.closeModal = this.closeModal.bind(this)
    this.onLogOut = this.onLogOut.bind(this)
    this.facebookLogin = this.facebookLogin.bind(this)
  } 

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  onLogin() {
    let username = document.querySelector('#loginUsername').value
    let password = document.querySelector('#loginPassword').value
    axios.post('/login', { username, password }).then(({ data: { userID, username } }) => {
      if (userID) {
        this.closeModal()
        this.props.toggleLogin(userID, username)
      }
    })
    .catch(err => this.onLoginFail(err))
  }

  onLogOut() {
    axios.post('/logout', {userID: this.props.userData}).then((response) => {   
      if (response.data) {
        this.props.toggleLogin(null, null)
      }
    })
  }

  onLoginFail(err) {
    console.error('Login failure Message', err);
    this.setState({error: true});
    this.finishLoading();
  }

  onRegister() {
    let email = document.querySelector('#registerEmail').value
    let username = document.querySelector('#registerUsername').value
    let password = document.querySelector('#registerPassword').value
    axios.post('/signup', {
      email: email,
      username: username,
      password: password
    }).then((response) => {
      let userID, username;
      ({userID, username} = response.data)
      this.props.toggleLogin(userID, username)    
    })
    .catch(err => this.onLoginFail(err))
  }

  startLoading() {
    this.setState({
      loading: true
    })
  }

  finishLoading() {
    this.setState({
      loading: false
    })
  }

  onTabsChange() {
    this.setState({
      error: null
    });
  }

  facebookLogin(oauth, res) {
    axios.get(`https://graph.facebook.com/me?fields=id,name,picture,website,gender,verified,link&access_token=${res.authResponse.accessToken}`)
    .then(({ data: { gender, id, link, name: username, picture: { data: { url: picture } } , verified, email} }) => {
      axios.post('/facebookLogin', { username, email, id, picture, gender, link, verified })
      .then(({ data:{ userID, username } }) => {
        this.closeModal()
        this.props.toggleLogin(userID, username)    
      })
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  }

    render() {
      return (
      <header className="nav">
        <span className="logo" ><Link to="/" style={{color: '#ffffff', textDecoration: 'none'}}>Friend.ly</Link></span>
        {' '}
        <ul id="nav">
        <li><Link to="/search" style={{color: '#ffffff', textDecoration: 'none'}}>Search</Link></li>
        {' '}
        { 
          this.props.isLogin &&
          <li><Link to={`/profile/${this.props.userData}`} style={{color: '#ffffff', textDecoration: 'none'}}>Profile</Link></li>          
        }
        {' '}
        { 
          this.props.isLogin &&
          <li style={{color: '#ffffff', textDecoration: 'none'}}><GoogleAuth event={this.props.confirmedEvent}/></li>
        }
        {' '}
        {
          !this.props.isLogin &&
          <li>
            <Link to="/" style={{color: '#ffffff', textDecoration: 'none'}}
              onClick={() => this.openModal()}
            >
            Login
          </Link>
          <ReactModalLogin
            visible={this.state.showModal}
            onCloseModal={this.closeModal.bind(this)}
            loading={this.state.loading}
            error={this.state.error}
            tabs={{
              onChange: this.onTabsChange.bind(this)
            }}
            loginError={{
              label: "Couldn't sign in, please try again."
            }}
            registerError={{
              label: "Couldn't sign up, please try again."
            }}
            startLoading={this.startLoading.bind(this)}
            finishLoading={this.finishLoading.bind(this)}
            providers={{
              facebook: {
                config: {
                appId: FACEBOOKAPI,
                cookie: true,
                version: 'v2.12',
                xfbml: true,
                },
                onLoginSuccess: this.facebookLogin.bind(this),
                onLoginFail: this.onLoginFail.bind(this),
                label: "Continue with Facebook"
              }}}
            form = {{
              onLogin: this.onLogin.bind(this),
              loginBtn: {
                  label: 'Login'
              },
              loginInputs: [
              {
                  id: 'loginUsername',
                  type: 'text',
                  placeholder: 'username'
              },
              {
                  id: 'loginPassword',
                  type: 'password',
                  placeholder: 'password'
              } 
              ],
              onRegister: this.onRegister.bind(this),
              registerBtn: {
                  label: 'Register'
              },
              registerInputs: [
              {
                  id: 'registerEmail',
                  type: 'text',
                  placeholder: 'email'
              },
              {
                  id: 'registerUsername',
                  type: 'text',
                  placeholder: 'username'
              },
              {
                  id: 'registerPassword',
                  type: 'password',
                  placeholder: 'password'
              }
              ]
            }}
          /></li>
        }
        {
          this.props.isLogin &&
          (<li><Link to="/" onClick={this.onLogOut} style={{color: '#ffffff', textDecoration: 'none'}}>Logout
            </Link></li>) 
        }     
        </ul>  
        </header>
    )
    }
}
export default Header;