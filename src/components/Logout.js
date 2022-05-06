import { useContext, useEffect, useState } from "react"
import { auth, db } from "../firebase";
import { setDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useUserAuth } from '../contexts/UserAuthContext';
import { Link } from 'react-router-dom';


const Logout = () => {
    const [user, setUser] = useState()
    const [localUser, setLocalUser] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const { logOut } = useUserAuth() || {};

    return(
        <button onClick={() => logOut(auth)}>Logout</button>
    )

}

export default Logout