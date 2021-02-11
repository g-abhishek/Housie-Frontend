import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux'
import { BrowserRouter ,Switch, Route, Redirect } from 'react-router-dom'
import {createBrowserHistory} from 'history';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Index from './Components/Index';
import store from './Redux/store';
import Login from './Components/Login';
import UserRegistration from './Components/UserRegistration';


const history = createBrowserHistory()

function App() {
  return (
    <Provider store={store}>
      <div className="App">    
        <ReactNotification />     
        
        <BrowserRouter history={history}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/registration">
              <UserRegistration />
            </Route>
            <Route path="/index">
              <Index />
            </Route>
            {localStorage.getItem('tokn') ? <Redirect to="/index"/> : <Redirect to="/login"/>}
          </Switch>
        </BrowserRouter>  
      </div>
    </Provider>
  );
}

export default App;
