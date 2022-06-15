import './ViewProfile.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, where } from 'firebase/firestore'
import { db } from '../firebase'
import PostElements from './PostElements'
import ReplyModal from './ReplyModal'
import MessageModal from './MessageModal'

const ViewProfile = () => {

    const { authUser } = useUserAuth()
    const { username } = useParams()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()
    const [profileUser, setProfileUser] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [postId, setPostId] = useState()


    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            getProfileUser(username)
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

    const getProfileUser = async () => {
        const q = query(collection(db, 'users'), where("username", "==", username))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docItem) => {
            setProfileUser(docItem.data())
        })
    }


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
            <div className='profileView--content--container'>
                <div className='profileView--container'>
                    <img className='profileView--image' src={profileUser?.profile_image} />
                    <h1 className='profileView--username'>{profileUser?.username}</h1>
                    <h4 className='profileView--followers'>Followers: {profileUser?.followers_count}</h4>
<<<<<<< HEAD
                    <span onClick={() => handleMessage(username)} class="material-icons profileView--mail">mail</span>
=======
>>>>>>> b3bd6f9ae59f130ac65aacd202425d7cf927fda6
                </div>
                {postData && <PostElements handleReply={handleReply} handleMessage={handleMessage} postData={postData} />}
                {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
                {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
            </div>
        )
    }
}

export default ViewProfile