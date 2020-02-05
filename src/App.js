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
import NoMatch from './components/NoMatch';
import OthersProfile from './components/OthersProfile';

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
        <Route path='/myprofile/:handle' component={MyProfile} />
        <Route path='/editprofile/:handle' component={EditProfile} />
        <Route path='/user/:handle' component={OthersProfile} />
        <Route component={NoMatch}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
