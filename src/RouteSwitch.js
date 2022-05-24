import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import ViewPost from "./components/ViewPost";
import { UserAuthContextProvider} from "./contexts/UserAuthContext";


const RouteSwitch = () => {

    return (

        <BrowserRouter>
            <UserAuthContextProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="/" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path='notifications' element={<Notifications />} />
                        <Route path="/post/:id" element={<ViewPost />} />
                    </Route>
                </Routes>
            </UserAuthContextProvider>
        </BrowserRouter>

    );
};

export default RouteSwitch;