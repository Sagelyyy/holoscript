import { BrowserRouter, Routes, Route } from "react-router-dom";
import useUserData from "./hooks/useUserData";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { useState, useEffect } from "react";

const RouteSwitch = () => {

    const [userData, setUserData] = useUserData()
    const [tweetData, setTweetData]= useState({
            "created_at": "",
            "id": null,
            "id_str": "",
            "text": "",
            "user": {},  
            "entities": {}
           
    })

    console.log(userData)

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