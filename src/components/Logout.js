import React from "react";
import { auth, db } from "../firebase";
import { useUserAuth } from '../contexts/UserAuthContext';


const Logout = () => {
    const { logOut } = useUserAuth();
    const { authUser } = useUserAuth();

    return(
        <div>
        {authUser && <button onClick={() => logOut(auth)}>Logout</button>}
        </div>
    )

}

export default Logout