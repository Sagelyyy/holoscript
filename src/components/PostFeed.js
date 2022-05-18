import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, } from 'firebase/firestore'
import { db } from '../firebase'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()
    const [allUsers, setAllUsers] = useState()

    console.log(allUsers)

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const unsub = onSnapshot(doc(db, "allScripts", "scriptdata"), (doc) => {
                setPostData(doc.data())
            });
            return unsub
        }

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

    const postElements = postData?.scripts.map((item, i) => {
        return (
            <div key={i} className='postFeed--container'>
                <div className='postFeed--user--container'>
                    <img className="postFeed--user--avatar" src={item.user_profile_image} />
                    <h3 className='postFeed--user--username'>{item.user}</h3>
                </div>
                <h4 className='postFeed--content'>{item.post}</h4>
                <p>TODO: ADD BUTTONS!</p>
            </div>
        )
    }).reverse()


    return (
        <div className='postFeed--content--container'>
            {postElements}
        </div>

    )
}

export default PostFeed