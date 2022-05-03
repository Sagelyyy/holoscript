import { BrowserRouter, Routes, Route } from "react-router-dom";
import useFirebase from "./hooks/useFirebase";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { useState, useEffect } from "react";

const RouteSwitch = () => {

  // "id": null,
	// "id_str": "",
	// "name": "",
	// "screen_name": "",
	// "location": "",
	// "description": "",
	// "url": "",
  // "followers_count": null,
	// "friends_count": null,
	// "listed_count": null,
	// "created_at": "",
  // "profile_image": ""

    const [userData] = useFirebase('users')
    const [scripts] = useFirebase('allScripts')

    console.log(userData)
    console.log(scripts)

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