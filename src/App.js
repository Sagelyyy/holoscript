import './App.css';
import { Outlet, Link } from "react-router-dom"
import AccountTab from './components/AccountTab';
import { useUserAuth } from './contexts/UserAuthContext';
import { useEffect } from 'react';

function App() {

  const { authUser } = useUserAuth();

  return (
    <div className='app--container'>
      <nav className='app--menu'>
        <div className='nav--links--container'>
          <h1 className='app--title'>HoloScript.</h1>
          <Link className="nav--link" to="/"><span className="material-icons">
            home
          </span> Home</Link>
          {authUser &&
            <div className='nav--links--loggedIn--container'>
              <Link className="nav--link" to="/profile"><span className="material-icons">
                person
              </span> profile</Link>
              <Link className="nav--link" to="/messages"><span className="material-icons">
                chat
              </span> messages</Link>
              <Link className="nav--link" to="/notifications"><span className="material-icons">
                notifications
              </span> notifications</Link>
            </div>
          }
        </div>
        <div className='account--container'>
          <AccountTab />
        </div>
      </nav>
      <div className='content--container'>
        <Outlet />
      </div>
      <div className='app--sidebar'>
      </div>
    </div>
  );
}

export default App;
