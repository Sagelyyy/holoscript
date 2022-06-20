import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import ViewPost from "./components/ViewPost";
import { UserAuthContextProvider} from "./contexts/UserAuthContext";
import ViewProfile from "./components/ViewProfile";


const RouteSwitch = () => {

    return (

        <HashRouter basename="/">
            <UserAuthContextProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="/" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="/post/:id" element={<ViewPost />} />
                        <Route path="/user/:username" element={<ViewProfile />} />
                    </Route>
                </Routes>
            </UserAuthContextProvider>
        </HashRouter>

    );
};

export default RouteSwitch;