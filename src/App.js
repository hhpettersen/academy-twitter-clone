import React from 'react';
import { HashRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Login from './components/Login';
import Feed from './components/Feed';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Authenticate from './components/Authenticate';
import MyProfile from './components/MyProfile';
import EditProfile from './components/Editprofile';

// Switch sørger for at Route kun matcher på ett treff. 

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/' exact component={Authenticate} />
        <Route path='/home' component={Feed} />
        <Route path='/login' component={Login} />
        <Route path='/logout' component={Logout} />
        <Route path='/signup' component={Signup} />
        <Route path='/myprofile' component={MyProfile} />
        <Route path='/editprofile' component={EditProfile} />
      </Switch>
    </HashRouter>
  );
}

export default App;
