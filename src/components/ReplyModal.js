import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { doc, getDoc, updateDoc, arrayUnion, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from 'nanoid';
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
        const scriptsRef = doc(db, 'allScripts', 'scriptdata')
        await addDoc(collection(db, 'replies'), post)
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
                media: []
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