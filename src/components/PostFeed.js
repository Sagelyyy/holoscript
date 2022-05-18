import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, } from 'firebase/firestore'
import { db } from '../firebase'
import MessageModal from './MessageModal'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()
    const [allUsers, setAllUsers] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [messageSelection, setMessageSelection] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const unsub = onSnapshot(doc(db, "allScripts", "scriptdata"), (doc) => {
                setPostData(doc.data())
            });
            return unsub
        }
        setShowMessageModal(false)
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

    const handleMessage = (username) => {
        setMessageSelection(username)
        setShowMessageModal((old) => !old)
    }

    const postElements = postData?.scripts.map((item, i) => {
        return (
            <div key={i} className='postFeed--container'>
                <div className='postFeed--user--container'>
                    <img className="postFeed--user--avatar" src={item.user_profile_image} />
                    <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                </div>
                <h4 className='postFeed--content'>{item.post}</h4>
                <p>TODO: ADD BUTTONS!</p>
            </div>
        )
    }).reverse()


    return (
        <div className='postFeed--content--container'>
            {showMessageModal ? <MessageModal messageSelection={messageSelection}/> : null}
            {postElements}
        </div>

    )
}

export default PostFeed