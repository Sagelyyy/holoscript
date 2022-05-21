import './PostFeed.css'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useEffect, useState } from 'react'
import { getDoc, doc, onSnapshot, updateDoc, query, where, collection, getDocs, arrayUnion, QuerySnapshot, increment, } from 'firebase/firestore'
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
            // const unsub = onSnapshot(doc(db, "allScripts"), (doc) => {
            //     console.log(doc)
            // });
            // return unsub
            const q = query(collection(db, 'allScripts'))
            const unsub = onSnapshot(q, (querySnapshot) => {
                const posts = []
                querySnapshot.forEach((doc) => {
                    posts.push(doc.data())
                })
                setPostData(posts)
            })
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

    const checkLikedPosts = (arr, user) => {
        return arr.some(arrVal => user.username.toLowerCase() === arrVal)
    }

    const handleLike = async (postId) => {
        const selectedPost = []
        postData.map(async (item, i) => {
            if (item.id === postId) {
                if(!checkLikedPosts(item.liked_by, user)){
                    const q = query(collection(db, 'allScripts'))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === postId) {
                            const postsRef = doc(db, 'allScripts', scr.id)
                            updateDoc(postsRef, {
                                likes: increment(1)
                            })
                            updateDoc(postsRef, {
                                liked_by: arrayUnion(user.username)
                            })
                        }
                    })
                }
            }
        })

    }

    const postElements = postData?.map((item, i) => {
        return (
            <div key={i} className='postFeed--container'>
                <div className='postFeed--user--container'>
                    <img className="postFeed--user--avatar" src={item.user_profile_image} />
                    <h3 onClick={() => handleMessage(item.user)} className='postFeed--user--username'>{item.user}</h3>
                </div>
                <h4 className='postFeed--content'>{item.post}</h4>
                <div className='postFeed--buttons'>
                    <span onClick={() => handleLike(item.id)} className="material-icons postButton">favorite{item.likes && <span>{item.likes}</span>}</span>
                    <span className="material-icons postButton">forum</span>
                </div>

            </div>
        )
    })


    return (
        <div className='postFeed--content--container'>
            {showMessageModal ? <MessageModal messageSelection={messageSelection} /> : null}
            {postElements}
        </div>

    )
}

export default PostFeed