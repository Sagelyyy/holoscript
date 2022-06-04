import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, getDoc, updateDoc, arrayUnion, setDoc, addDoc, collection, getDocs, query, increment } from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from 'nanoid';
import { parseMedia } from '../utils/media';
import './ReplyModal.css'


const ReplyModal = (props) => {

    const {authUser} = useUserAuth()
    const [error, setError] = useState()
    const [user, setUser] = useState()
    const [submitted, setSubmitted] = useState()
    const [post, setPost] = useState()

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
        }else{
            // other stuff
        }
    }, [authUser])

    useEffect(() => {
        if(submitted && post.user){
            writePostData(post)
            setSubmitted(false)
            setPost((old) => {
                return({
                    ...old,
                    post: ''
                })
            })
        props.setShowReplyModal(false)
        }
    }, [post])
    
    const getUserData = async () => {
        if (authUser != null) {
            const userRef = doc(db, 'users', authUser.uid)
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                setUser(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        }
    }

    const writePostData = async (post) => {
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, { "replies": arrayUnion(post) })
        await addDoc(collection(db, 'replies'), post)
        const q = query(collection(db, 'allScripts'))
                    const querySnapshot = await getDocs(q)
                    querySnapshot.forEach((scr) => {
                        if (scr.data().id === props.postId) {
                            const postsRef = doc(db, 'allScripts', scr.id)
                            updateDoc(postsRef, {
                                replies: increment(1)
                            })
                        }
                    })
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setPost(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    const handleSubmit = async (e) => {
        setPost((old) => {
            return({
                ...old,
                time: Date.now(),
                user: user.username,
                id: nanoid(),
                user_profile_image: user?.profile_image,
                likes: 0,
                liked_by: [],
                in_reply_to: props.postId,
                media: parseMedia(post.reply)
            })
        })
        e.preventDefault()
        setSubmitted(true)
    }

    return(
        <div className="ReplyModal--container">
        <h3>Reply to Script.</h3>
        <form className='ReplyModal--form' onSubmit={handleSubmit}>
            {error && <h5>{error}</h5>}
            <textarea name='reply' onChange={handleChange} placeholder="What do you want to say?"></textarea>
            <br></br>
            <button>Submit</button>
        </form>
    </div>
    )


}


export default ReplyModal