import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import LoginModal from './LoginModal'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useState, useEffect } from 'react'
import PostFeed from './PostFeed'

const Home = () => {

    const { authUser } = useUserAuth()
    const [newUser, setNewUser] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (authUser != null) {
            setShowModal(false)
        } else {
            setShowModal(true)
        }
    }, [authUser])


    return (
        <div className="home--container">
            <h1 style={{ color: 'white' }}>Home</h1>
            {newUser && showModal ? <SignUpModal setNewUser={setNewUser} /> : null}
            {!newUser && showModal ? <LoginModal setNewUser={setNewUser} /> : null}
            <Post />
            <PostFeed />
        </div>

    )
}

export default Home