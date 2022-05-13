import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import './Post.css'
import { nanoid } from 'nanoid';

const Post = () => {

    const { authUser } = useUserAuth()
    const [post, setPost] = useState({
        post:''
    })
    const [user, setUser] = useState()
    const [submitted, setSubmitted] = useState(false)

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
        }
    }, [post])

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
                user_profile_image: user?.profile_image
            })
        })
        e.preventDefault()
        setSubmitted(true)
    }

    const writePostData = async (post) => {
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, { "posts": arrayUnion(post) })
        const scriptsRef = doc(db, 'allScripts', 'scriptdata')
        await updateDoc(scriptsRef, { "scripts": arrayUnion(post) })
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