
import './ViewPost.css'
import { Link, useParams } from "react-router-dom"
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, where } from 'firebase/firestore'
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/UserAuthContext";
import { doesUserExist } from '../utils/user';
import ReplyModal from "./ReplyModal";
import MessageModal from './MessageModal';
import PostElements from './PostElements'

const ViewPost = () => {

    const { authUser } = useUserAuth()
    const { id } = useParams()
    const [postData, setPostData] = useState([])
    const [replyData, setReplyData] = useState([])
    const [user, setUser] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [postId, setPostId] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const q = query(collection(db, "allScripts"), where("id", "==", id));
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
    }, [authUser, id])

    useEffect(() => {
        if (authUser?.uid != null) {
            const q = query(collection(db, "allScripts"), where("in_reply_to", "==", id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const replies = [];
                querySnapshot.forEach((doc) => {
                    replies.push(doc.data());
                });
                replies.sort((a, b) => a.time - b.time)
                setReplyData([...replies])

            });
            return unsubscribe
        }
        setUser()
    }, [user])

    const handleReply = (id) => {
        setShowReplyModal(true)
        setPostId(id)
    }


    const handleMessage = (username) => {
        setMessageSelection(username)
        setShowMessageModal((old) => !old)
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

   

    return (
        <div className='replyFeed--content--container'>
            <PostElements handleReply={handleReply} postData={postData} />
            <PostElements handleReply={handleReply} postData={replyData} />
            {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
            {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
        </div>
    )
}

export default ViewPost