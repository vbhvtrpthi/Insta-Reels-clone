import logo from './logo.svg';
import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Forgot from './Components/Forgot';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext'
import Feed from './Components/Feed';
import PrivateRoute from './Components/PrivateRoute';
import Profile from './Components/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Switch sey ek bari mey ek he route chalega */}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot" component={Forgot} />
          <PrivateRoute path="/profile/:id" component={Profile} />
         
          {/* PrivateRoute because ham chhate hai banda feed pey log in krne key baad aaye, ya fir signup krne key baad directly aaye */}
          <PrivateRoute path="/" component={Feed} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
