import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, } from 'firebase/firestore'
import { db } from '../firebase'
import { doesUserExist, getFollowing } from '../utils/user'
import MessageModal from './MessageModal'
import { Link } from 'react-router-dom'
import ReplyModal from './ReplyModal'

const PostFeed = () => {

    const { authUser } = useUserAuth()
    const [postData, setPostData] = useState()
    const [user, setUser] = useState()
    const [allUsers, setAllUsers] = useState()
    const [showMessageModal, setShowMessageModal] = useState()
    const [messageSelection, setMessageSelection] = useState()
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [postId, setPostId] = useState()
    const [postElem, setPostElem] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            const q = query(collection(db, 'allScripts'))
            const unsub = onSnapshot(q, (querySnapshot) => {
                const posts = []
                querySnapshot.forEach((doc) => {
                    posts.push(doc.data())
                })
                posts.sort((a, b) => a.time - b.time).reverse()
                setPostData(posts)
            })
            return unsub
        }
        setShowMessageModal(false)
        setUser()
    }, [authUser])

    useEffect(() => {
        console.log(user)
    },[user])


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

    const handleFollow = async (userId) => {

        const currUser = user.username.toLowerCase()

        const currUserRef = doc(db, 'users', authUser.uid)

        const q = query(collection(db, 'users'))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((snap) => {
            if (snap.id === userId) {
                if (!doesUserExist(snap.data().followed_by, user)) {
                    const userRef = doc(db, 'users', snap.id)
                    updateDoc(userRef, {
                        followers_count: increment(1)
                    })
                    updateDoc(userRef, {
                        followed_by: arrayUnion(currUser)
                    })
                    updateDoc(currUserRef, {
                        following: arrayUnion(snap.data().username.toLowerCase())
                    })
                } else {
                    const userRef = doc(db, 'users', snap.id)
                    updateDoc(userRef, {
                        followers_count: increment(-1)
                    })
                    updateDoc(userRef, {
                        followed_by: arrayRemove(currUser)
                    })
                    updateDoc(currUserRef, {
                        following: arrayRemove(snap.data().username.toLowerCase())
                    })
                }
            }
        })

    }

    const handleLike = async (postId) => {
        postData.map(async (item, i) => {
            if (item.id === postId) {
                if (!doesUserExist(item.liked_by, user)) {
                    const q = query(collection(db, 'allScripts'))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === postId) {
                            const postsRef = doc(db, 'allScripts', scr.id)
                            updateDoc(postsRef, {
                                likes: increment(1)
                            })
                            updateDoc(postsRef, {
                                liked_by: arrayUnion(user.username.toLowerCase())
                            })
                        }
                    })
                } else {
                    const q = query(collection(db, 'allScripts'))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === postId) {
                            const postsRef = doc(db, 'allScripts', scr.id)
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

    const handleReply = (id) => {
        setShowReplyModal(true)
        setPostId(id)
    }

    const testElem = async () => {
        const elems = await Promise.all(postElements)
        setPostElem(elems)
    }

    const postElements = postData?.map(async (item, i) => {
        if (item.liked_by.some(arrVal => user?.username.toLowerCase() === arrVal)) {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <div className='postFeed--userIconName'>
                            <img className="postFeed--user--avatar" src={item.user_profile_image} />
                            <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                        </div>
                        <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                            person_add
                        </span>

                        {/* This is so close to working...getFollowing is returning a promise, so the arr.some fails*/}

                        {/* {doesUserExist(getFollowing(authUser), user) ?
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_add
                            </span> :
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_remove
                            </span>} */}
                    </div>
                    <Link to={'post/' + item.id}>
                        <div className='postFeed--content'>
                            <h4 className='postFeed--post'>{item.post}</h4>
                            <div className='postFeed--media--container'>
                                {item.media && item.media.map((image, j) => {
                                    return (
                                        <div key={j}>
                                            <img className='postFeed--media' src={image} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Link>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id)} className="material-icons postButton liked">
                            favorite{item.likes > 0 ? <span className='postFeed--likes liked'>{item.likes}</span> : null}</span>
                        <span onClick={() => handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='postFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <div className='postFeed--userIconName'>
                            <img className="postFeed--user--avatar" src={item.user_profile_image} />
                            <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                        </div>
                        <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                            person_add
                        </span>

                        {/* {doesUserExist(getFollowing(authUser), user) ?
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_add
                            </span> :
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_remove
                            </span>} */}
                    </div>
                    <Link to={'post/' + item.id}>
                        <div className='postFeed--content'>
                            <h4 className='postFeed--post'>{item.post}</h4>
                            <div className='postFeed--media--container'>
                                {item.media && item.media.map((image, j) => {
                                    return (
                                        <div key={j}>
                                            <img className='postFeed--media' src={image} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Link>
                    <div className='postFeed--buttons'>
                        <span onClick={() => handleLike(item.id)} className="material-icons postButton">
                            favorite{item.likes > 0 ? <span className='postFeed--likes'>{item.likes}</span> : null}</span>
                        <span onClick={() => handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='postFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
        }
    })


    if (user) {
        return (
            <div className='postFeed--content--container'>
                {showMessageModal ? <MessageModal setShowMessageModal={setShowMessageModal} messageSelection={messageSelection} /> : null}
                {postElem && postElem.map(item => item)}
                {showReplyModal ? <ReplyModal setShowReplyModal={setShowReplyModal} postId={postId} /> : null}
            </div>

        )
    }
}

export default PostFeed