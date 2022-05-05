import { BrowserRouter, Routes, Route } from "react-router-dom";
import useFirebase from "./hooks/useFirebase";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { useState, useEffect } from "react";
import { UserAuthContextProvider } from "./contexts/UserAuthContext";


const RouteSwitch = () => {

    const [user, setUser] = useState({})
    const [userData] = useFirebase('users')
    const [scripts] = useFirebase('allScripts')

    return (

        <BrowserRouter>
            <UserAuthContextProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="/" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path='notifications' element={<Notifications />} />
                    </Route>
                </Routes>
            </UserAuthContextProvider>
        </BrowserRouter>

    );
};

export default RouteSwitch;