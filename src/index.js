import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import * as firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker';
const store = configureStore();
var config = {
  apiKey: "AIzaSyAtgtsGG1qkx5Q5SPvTTlYmN_Vqd9B_1f0",
  authDomain: "rtc-hosting.firebaseapp.com",
  databaseURL: "https://rtc-hosting.firebaseio.com",
  projectId: "rtc-hosting",
  storageBucket: "rtc-hosting.appspot.com",
  messagingSenderId: "339860876001"
};
  firebase.initializeApp(config);
ReactDOM.render(<MuiThemeProvider >
                  <Provider store={store}>
                      <App />
                  </Provider>
              </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
