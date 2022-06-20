import './AccountTab.css'
import { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/UserAuthContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Logout from './Logout';
const AccountTab = () => {

    const { authUser } = useUserAuth()
    const [user, setUser] = useState()
    const [showOptions, setShowOptions] = useState(false)
    const [showTab, setShowTab] = useState(false)

    useEffect(() => {
        if (authUser?.uid != null) {
            // getUserData()
            setShowOptions(false)
            const unsub = onSnapshot(doc(db, 'users', authUser.uid), (doc) => {
                setUser(doc.data())
                setShowTab(true)
            });
            return unsub
        } else {
            setShowTab(false)
            setShowOptions(false)
        }

    }, [authUser])

    const getUserData = async () => {
        if (authUser != null) {
            const userRef = doc(db, 'users', authUser.uid)
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                setUser(docSnap.data());
                setShowTab(true)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        }
    }

    const handleOptions = () => {
        setShowOptions((old) => !old)
    }

    if (user && showTab) {
        return (
            <div>
                <div className='accountTab--options--container'>
                    {showOptions && <ul className='accountTab--options'>
                        <li><Logout /></li>
                    </ul>}
                </div>
                <div onClick={handleOptions} className="accountTab--container">
                    {user?.profile_image && <img className="accountTab--avatar" src={user?.profile_image}></img>}
                    {user && <h2 className='accountTab--username'>{user.username}</h2>}
                    {user && <h4 className='accountTab--options'>...</h4>}
                </div>
            </div>
        )
    }
}

export default AccountTab;