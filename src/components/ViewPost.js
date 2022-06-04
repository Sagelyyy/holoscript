
import './ViewPost.css'
import { Link, useParams } from "react-router-dom"
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, where } from 'firebase/firestore'
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/UserAuthContext";
import { didUserLike } from '../utils/user';
import ReplyModal from "./ReplyModal";
import MessageModal from './MessageModal';

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
    }, [authUser])

    useEffect(() => {
        if (authUser?.uid != null) {
            const q = query(collection(db, "replies"), where("in_reply_to", "==", id));
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

    const handleLike = async (postId, col, arr) => {
        arr.map(async (item, i) => {
            if (item.id === postId) {
                if (!didUserLike(item.liked_by, user)) {
                    const q = query(collection(db, col))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === postId) {
                            const postsRef = doc(db, col, scr.id)
                            updateDoc(postsRef, {
                                likes: increment(1)
                            })
                            updateDoc(postsRef, {
                                liked_by: arrayUnion(user.username.toLowerCase())
                            })
                        }
                    })
                } else {
                    const q = query(collection(db, col))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === postId) {
                            const postsRef = doc(db, col, scr.id)
                            updateDoc(postsRef, {
                                likes: increment(-1)
                            })
                            updateDoc(postsRef, {
                                liked_by: arrayRemove(user.username.toLowerCase())
                            })
                        }
                    })
                }
            }
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

    const postElements = postData?.map((item, i) => {
        if (item.liked_by.some(arrVal => user?.username.toLowerCase() === arrVal)) {
            return (
                <div key={i} className='replyFeed--container'>
                    <div className='replyFeed--user--container'>
                        <img className="replyFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='replyFeed--user--username'>{item.user}</h3>
                    </div>
                    <div className='replyFeed--content'>
                        <h4>{item.post}</h4>

                        <div className='replyFeed--media--container'>
                            {item.media && item.media.map((image, j) => {
                                return (
                                    <div key={j}>
                                        <img className='replyFeed--media' src={image} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='replyFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'allScripts', postData)} className="material-icons postButton liked">
                            favorite{item.likes > 0 ? <span className='replyFeed--likes liked'>{item.likes}</span> : null}</span>
                        <span onClick={() => handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='replyFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className='replyFeed--container'>
                    <div className='replyFeed--user--container'>
                        <img className="replyFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='replyFeed--user--username'>{item.user}</h3>
                    </div>
                    <div className='replyFeed--content'>
                        <h4>{item.post}</h4>

                        <div className='replyFeed--media--container'>
                            {item.media && item.media.map((image, j) => {
                                return (
                                    <div key={j}>
                                        <img className='replyFeed--media' src={image} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='replyFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'allScripts', postData)} className="material-icons postButton">
                            favorite{item.likes > 0 ? <span className='replyFeed--likes'>{item.likes}</span> : null}</span>
                        <span onClick={() => handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='replyFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
        }
    })

    const replyElements = replyData?.map((item, i) => {
        // I wonder whats happening in the links ???
        if (item.liked_by.some(arrVal => user?.username.toLowerCase() === arrVal)) {
            return (
                <div key={i} className='replyFeed--container'>
                    <div className='replyFeed--user--container'>
                        <img className="replyFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='replyFeed--user--username'>{item.user}</h3>
                    </div>
                    <Link to={`/post/${item.id}`}>
                        <div>
                            <h4 className='replyFeed--content'>{item.reply}</h4>
                        </div>
                    </Link>
                    <div className='replyFeed--media--container'>
                        {item.media && item.media.map((image, j) => {
                            return (
                                <div key={j}>
                                    <img className='replyFeed--media' src={image} />
                                </div>
                            )
                        })}
                    </div>
                    <div className='replyFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'replies', replyData)} className="material-icons postButton liked">
                            favorite{item.likes > 0 ? <span className='replyFeed--likes liked'>{item.likes}</span> : null}</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className='replyFeed--container'>
                    <div className='replyFeed--user--container'>
                        <img className="replyFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='replyFeed--user--username'>{item.user}</h3>
                    </div>
                    <Link to={`/post/${item.id}`}>
                        <div>
                            <h4 className='replyFeed--content'>{item.reply}</h4>
                        </div>
                    </Link>
                    <div className='replyFeed--media--container'>
                        {item.media && item.media.map((image, j) => {
                            return (
                                <div key={j}>
                                    <img className='replyFeed--media' src={image} />
                                </div>
                            )
                        })}
                    </div>
                    <div className='replyFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'replies', replyData)} className="material-icons postButton">
                            favorite{item.likes > 0 ? <span className='replyFeed--likes'>{item.likes}</span> : null}</span>
                    </div>
                </div>
            )
        }
    })

    return (
        <div className='replyFeed--content--container'>
            {postElements}
            {replyElements}
            {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
            {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
        </div>
    )
}

export default ViewPost