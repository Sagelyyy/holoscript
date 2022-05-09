import './App.css';
import { Outlet, Link } from "react-router-dom"
import Logout from './components/Logout';
import AccountTab from './components/AccountTab';

function App() {

  return (
    <div className='app--container'>
      <nav className='app--menu'>
        <div className='nav--links--container'>
          <Link className="nav--link" to="/">Home</Link>
          <Link className="nav--link" to="/profile">profile</Link>
          <Link className="nav--link" to="/messages">messages</Link>
          <Link className="nav--link" to="/notifications">notifications</Link>
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
