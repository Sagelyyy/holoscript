import { BrowserRouter, Routes, Route } from "react-router-dom";
import useFirebase from "./hooks/useFirebase";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { useState, useEffect } from "react";
import GlobalUser from "./contexts/GlobalUser";


const RouteSwitch = () => {

    const [user, setUser] = useState({})
    const [userData] = useFirebase('users')
    const [scripts] = useFirebase('allScripts')

    return (
        <GlobalUser.Provider value={[user, setUser]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="/" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path='notifications' element={<Notifications />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalUser.Provider>
    );
};

export default RouteSwitch;