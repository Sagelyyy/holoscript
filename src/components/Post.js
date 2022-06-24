import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import './Post.css'
import { nanoid } from 'nanoid';
import { parseMedia } from '../utils/media';

const Post = () => {

    const { authUser } = useUserAuth()
    const [post, setPost] = useState({
        post: ''
    })
    const [user, setUser] = useState()
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (authUser?.uid != null) {
            getUserData()
        } else {
            // other stuff
        }
    }, [authUser])

    useEffect(() => {
        if (submitted && post.user) {
            writePostData(post)
            setSubmitted(false)
            setPost((old) => {
                return ({
                    ...old,
                    post: ''
                })
            })
        }
    }, [post])

    const handleChange = (e) => {
        const { name, value, maxLength } = e.target
        const postLimit = value.slice(0, maxLength)
        setPost(old => {
            return ({
                ...old,
                [name]: postLimit
            })
        })
    }

    const handleSubmit = async (e) => {
        setPost((old) => {
            return ({
                ...old,
                posted_by: authUser.uid,
                time: Date.now(),
                user: user.username,
                id: nanoid(),
                user_profile_image: user?.profile_image,
                likes: 0,
                liked_by: [],
                in_reply_to: null,
                replies: 0,
                media: parseMedia(post.post)
            })
        })
        e.preventDefault()
        setSubmitted(true)
    }

    const writePostData = async (post) => {
        const newPost = nanoid()
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, { "posts": arrayUnion(post) })
        const scriptsRef = doc(db, 'allScripts', 'scriptdata')
        await addDoc(collection(db, 'allScripts'), post)
    }

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



    return (
        <div className="post--container">
            <form onSubmit={handleSubmit} className='post--form'>
                <textarea onChange={handleChange} maxLength="255" name='post' value={post.post} className='post--textarea' placeholder='Whats happening?'></textarea>
                <button className='post--button'>Submit</button>
            </form>
        </div>
    )
}

export default Post