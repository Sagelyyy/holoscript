import { useParams } from "react-router-dom"
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, where } from 'firebase/firestore'
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/UserAuthContext";
import { Link } from "react-router-dom";

const ViewPost = () => {

    const { authUser } = useUserAuth()
    const { id } = useParams()
    const [postData, setPostData] = useState([])
    const [replyData, setReplyData] = useState([])
    const [user, setUser] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showMessageModal, setShowMessageModal] = useState()

    console.log(postData)
    console.log(replyData)

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            getReplyData(id)
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

    const handleMessage = (username) => {
        setMessageSelection(username)
        setShowMessageModal((old) => !old)
    }

    const didUserLike = (arr, user) => {
        return arr.some(arrVal => user.username.toLowerCase() === arrVal)
    }

    const handleLike = async (postId, col) => {
        //if post or if reply here
        postData.map(async (item, i) => {
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

    const getReplyData = async (id) => {
        const data = []
        const q = query(collection(db, "replies"), where("in_reply_to", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push(doc.data())
        });
        setReplyData([...data])
    }

    const postElements = postData?.map((item, i) => {
        if (item.liked_by.some(arrVal => user?.username === arrVal)) {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <img className="postFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                    </div>
                        <div>
                            <h4 className='postFeed--content'>{item.post}</h4>
                        </div>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'allScripts')} className="material-icons postButton liked">
                            favorite{item.likes > 0 ? <span className='postFeed--likes liked'>{item.likes}</span> : null}</span>
                        <span className="material-icons postButton">forum</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <img className="postFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                    </div>
                        <div>
                            <h4 className='postFeed--content'>{item.post}</h4>
                        </div>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'allScripts')} className="material-icons postButton">
                            favorite{item.likes > 0 ? <span className='postFeed--likes'>{item.likes}</span> : null}</span>
                        <span className="material-icons postButton">forum</span>
                    </div>
                </div>
            )
        }
    })

    const replyElements = replyData?.map((item, i) => {
        if (item.liked_by.some(arrVal => user?.username === arrVal)) {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <img className="postFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                    </div>
                        <div>
                            <h4 className='postFeed--content'>{item.reply}</h4>
                        </div>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id, 'replies')} className="material-icons postButton liked">
                            favorite{item.likes > 0 ? <span className='postFeed--likes liked'>{item.likes}</span> : null}</span>
                        <span className="material-icons postButton">forum</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <img className="postFeed--user--avatar" src={item.user_profile_image} />
                        <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                    </div>
                        <div>
                            <h4 className='postFeed--content'>{item.reply}</h4>
                        </div>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id,'replies')} className="material-icons postButton">
                            favorite{item.likes > 0 ? <span className='postFeed--likes'>{item.likes}</span> : null}</span>
                        <span className="material-icons postButton">forum</span>
                    </div>
                </div>
            )
        }
    })

    return (
        <div>
            {postElements}
            {replyElements}
        </div>
    )
}

export default ViewPost