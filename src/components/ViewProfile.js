import './ViewProfile.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, where } from 'firebase/firestore'
import { db } from '../firebase'

const ViewProfile = () => {

    const { authUser } = useUserAuth()
    const { username } = useParams()
    const [postData, setPostData] = useState()


    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const q = query(collection(db, "allScripts"), where("user", "==", username));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const post = [];
                querySnapshot.forEach((doc) => {
                    post.push(doc.data());
                });
                post.sort((a, b) => a.time - b.time).reverse()
                setPostData([...post])

            });
            return unsubscribe
        }
        setUser()
    }, [authUser])


    const getUserData = async () => {
        if (authUser != null) {
            const userRef = doc(db, 'users', authUser?.uid)
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                setUser(docSnap.data());
            } else {
                console.log("No such user!");
            }
        }
    }

    return(
        <h1>Hello Profile</h1>
    )
}