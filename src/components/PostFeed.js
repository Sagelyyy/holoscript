import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, query, collection, } from 'firebase/firestore'
import { db } from '../firebase'
import MessageModal from './MessageModal'
import ReplyModal from './ReplyModal'
import PostElements from './PostElements'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [postId, setPostId] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const q = query(collection(db, 'allScripts'))
            const unsub = onSnapshot(q, (querySnapshot) => {
                const posts = []
                querySnapshot.forEach((doc) => {
                    if (doc.data().in_reply_to === null) {
                        posts.push(doc.data())
                    }
                })
                posts.sort((a, b) => a.time - b.time).reverse()
                setPostData(posts)
            })
            return unsub
        }
        setShowMessageModal(false)
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

    const handleMessage = (username) => {
        setMessageSelection(username)
        setShowMessageModal((old) => !old)
    }

    const handleReply = (id) => {
        setShowReplyModal(true)
        setPostId(id)
    }


    if (user) {
        return (
            <div className='postFeed--content--container'>
                {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
                {postData && <PostElements handleReply={handleReply} handleMessage={handleMessage} postData={postData} />}
                {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
            </div>

        )
    }
}

export default PostFeed