import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="profile" element={<Profile/>} />
                    <Route path="messages" element={<Messages />} />
                    <Route path='notifications' element={<Notifications />} />
                </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;