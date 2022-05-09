import React, { useEffect, useState } from "react";
import './Logout.css'
import { auth, db } from "../firebase";
import { useUserAuth } from '../contexts/UserAuthContext';


const Logout = () => {
    const { logOut } = useUserAuth();
    const { authUser } = useUserAuth();

        return (
            <div>
                {authUser && <button className='logout--button' onClick={() => logOut(auth)}>Logout</button>}
            </div>
        )
    

}

export default Logout