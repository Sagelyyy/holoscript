import './App.css';
import { Outlet, Link } from "react-router-dom"

function App() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
          backgroundColor: "#EEEEEE"
        }}
      >
        <div className='nav--links--container'>
          <Link className="nav--link" to="/">Home</Link> | {" "}
          <Link className="nav--link" to="/profile">profile</Link> | {" "}
          <Link className="nav--link" to="/messages">messages</Link> | {" "}
          <Link className="nav--link" to="/notifications">notifications</Link> | {" "}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
