import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, getDoc, updateDoc, arrayUnion, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import './Post.css'
import { nanoid } from 'nanoid';

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
            console.log('fired')
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
        const { name, value } = e.target
        setPost(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    const parseMedia = (post) => {

        // for some reason when we push the array to firestore it puts the whole
        // array as the first element in firestore.

        console.log(post)
        const regex = /(https?:\/\/[^ ]*\.(?:gif|png|jpg|jpeg))/ig
        const arr = [...post.matchAll(regex)]
        const media = []
        for (const item of arr) {
            media.push(item[0])
        }
        console.log(media)
        return media
    }

    const handleSubmit = async (e) => {

        // for some reason when we push the array to firestore it puts the whole
        // array as the first element in firestore.

        setPost((old) => {
            return ({
                ...old,
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
                <textarea onChange={handleChange} name='post' value={post.post} className='post--textarea' placeholder='Whats happening?'></textarea>
                <button className='post--button'>Submit</button>
            </form>
        </div>
    )
}

export default Post