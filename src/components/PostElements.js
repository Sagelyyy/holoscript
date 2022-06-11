import './PostElements.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doesUserExist } from '../utils/user'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, updateDoc, query, collection, getDocs, arrayUnion, increment, arrayRemove, } from 'firebase/firestore'
import { db } from '../firebase'
import MessageModal from './MessageModal'
import { Link } from 'react-router-dom'
import ReplyModal from './ReplyModal'


const PostElements = (props) => {

    const { authUser } = useUserAuth()
    const [user, setUser] = useState()
    const [following, setFollowing] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
            getUserFollowing()
        }
        setUser()
    }, [authUser])

    const getUserFollowing = async () => {
        const unsub = onSnapshot(doc(db, 'users', authUser.uid), (doc) => {
            setFollowing(doc.data().following)
        })
        return unsub
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

    const handleFollow = async (userId) => {

        const currUser = user.username.toLowerCase()

        const currUserRef = doc(db, 'users', authUser.uid)

        const q = query(collection(db, 'users'))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((snap) => {
            if (snap.id === userId) {
                if (!doesUserExist(snap.data().followed_by, user.username)) {
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
        props.postData?.map(async (item, i) => {
            if (item.id === postId) {
                if (!doesUserExist(item.liked_by, user.username)) {
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


    const postElements = props.postData?.map((item, i) => {
        if (user) {
            return (
                <div key={i} className='postFeed--container'>
                    <div className='postFeed--user--container'>
                        <div className='postFeed--userIconName'>
                            <img className="postFeed--user--avatar" src={item.user_profile_image} />
                            <h3 onClick={() => props.handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                        </div>
                        {following && !doesUserExist(following, item.user) ?
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_add
                            </span> :
                            <span onClick={() => handleFollow(item.posted_by)} className="material-icons follow">
                                person_remove
                            </span>}
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
                        {item?.liked_by && doesUserExist(item.liked_by, user?.username) ?
                            <span onClick={() => handleLike(item.id)} className="material-icons postButton liked">
                                favorite{item.likes > 0 ? <span className='postFeed--likes liked'>{item.likes}</span> : null}</span> :
                            <span onClick={() => handleLike(item.id)} className="material-icons postButton">
                                favorite{item.likes > 0 ? <span className='postFeed--likes' >{item.likes}</span> : null}</span>}
                        <span onClick={() => props.handleReply(item.id)} className="material-icons postButton">
                            forum{item.replies > 0 ? <span className='postFeed--replies'>{item.replies}</span> : null}</span>
                    </div>
                </div>
            )
        }
    })

    if (user) {
        return (
            postElements
        )
    }

}


export default PostElements