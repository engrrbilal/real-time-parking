import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup'
import {Router, Route,Redirect} from 'react-router-dom';
import {IconButton,FlatButton,RaisedButton,AppBar} from 'material-ui';
import firebase from 'firebase'
import history from './history';
import User from './components/user';
import Admin from './components/Admin';
function PrivateRoute1({ component: Component, authed, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
      />
  )
}
function PrivateRoute2({ component: Component, authed, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
      />
  )
}

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      authed: false
    }
  }
  componentWillMount() {
    let that = this
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            that.setState({
                authed: true
            })
            let type = localStorage.getItem("type")
            let convertype = JSON.parse(type)
            if (convertype !== null) {
                history.push(convertype)
            }
        }
        else {
            console.log(user)
            that.setState({
                authed: false,
            })
        }
        console.log(this.state.authed)
    });
}
logOut =()=>{
//   window.location.reload()
  history.push('/')
  localStorage.clear()
}
  render() {
    return (
      <div >
          <AppBar
                title={"Real Time Parking"} style={{backgroundColor:"blue"}}
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={this.state.authed? <RaisedButton backgroundColor="blue" labelColor="yellow"
                label="Sign out"  onClick={() => firebase.auth().signOut().then(this.logOut())} 
                />:<FlatButton label="Sign in"  onClick={() => history.push('/')} />}
           />
          <Router history={history}>
            <div>
                <Route exact path="/" component={Login}/>
                <Route path="/signup" component={Signup} />
                <PrivateRoute1  authed={this.state.authed} path="/admin" component={Admin}/>
                <PrivateRoute2 authed={this.state.authed} path="/user" component={User} />
            </div>
      </Router>
      </div>
    );
  }
}
export default App;
