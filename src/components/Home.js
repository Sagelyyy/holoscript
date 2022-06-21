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
            {newUser && showModal ? <SignUpModal setNewUser={setNewUser} /> : null}
            {!newUser && showModal ? <LoginModal setNewUser={setNewUser} /> : null}
            {authUser &&
                <div>
                    <h1 style={{ color: 'white', padding: '5px' }}>Home</h1>
                    <Post />
                    <PostFeed />
                </div>
            }
        </div>

    )
}

export default Home