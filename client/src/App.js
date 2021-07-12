import React, { Fragment , useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/layouts/navbar'
import Landing from './components/layouts/landing'
import Login from './components/auths/login'
import Register from './components/auths/register'
import Alert from './components/layouts/Alert'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/router/PrivateRoute'
import CreateProfile from './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'
import AddExperience from './components/profile-form/AddExperience'
import AddEducation from './components/profile-form/AddEducation'
import store from './store'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth'
import './App.css';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser()) //to authenticate user once u load
  } , [])
  
  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>

)};



export default App;
