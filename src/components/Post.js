import { useState, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import './Post.css'

const Post = () => {
    const { authUser } = useUserAuth()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState()
    const [post, setPost] = useState()


    console.log(post)

    const getUserData = async (uid) => {
        setLoading(true)
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log(docSnap.data())
            setUser(docSnap.data())
            setLoading(false)
        } else {
            console.log('No Doc!')
            setLoading(false)
        }
    }

    const writeUserData = async (data) => {
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, { "posts": arrayUnion(data.post) })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        writeUserData(post)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setPost(old => {
            return ({
                ...old,
                [name]: value
            })
        })
    }

    useEffect(() => {
        if (authUser) {
            getUserData(authUser.uid)
        } else {
        }
    }, [authUser])

    if (user) {
        return (
            <div className="post--container">
                <form onSubmit={handleSubmit} className='post--form'>
                    <textarea onChange={handleChange} name='post' className='post--textarea' placeholder='Whats happening?'></textarea>
                    <button className='post--button'>Submit</button>
                </form>
            </div>
        )
    }
}

export default Post