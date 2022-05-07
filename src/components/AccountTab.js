import { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/UserAuthContext"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


const AccountTab = () => {
    const { authUser } = useUserAuth()
    const [showTab, setShowTab] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState()


    const getUserData = async (uid) => {
        setLoading(true)
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
            console.log(docSnap.data())
            setUser(docSnap.data())
            setLoading(false)
        } else {
            console.log('No Doc!')
            setLoading(false)
        }

    }  

    useEffect(() => {
        if (authUser) {
            getUserData(authUser.uid)
            setShowTab(true)
        } else {
            setShowTab(false)
        }
    }, [authUser])

    if (showTab) {
        return (
            <div>
                {!loading && <h1>{user.username}</h1>}
            </div>
        )
    }
}

export default AccountTab;