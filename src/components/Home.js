import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import LoginModal from './LoginModal'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useState } from 'react'
import PostFeed from './PostFeed'
import { setUserProperties } from 'firebase/analytics'

const Home = () => {

    const { authUser } = useUserAuth()
    const [newUser, setNewUser] = useState(false)

    return (
        <div className="home--container">
            <h1 style={{color: 'white'}}>Home</h1>
            {newUser && <SignUpModal setNewUser={setNewUser}/>}
            {!newUser && <LoginModal setNewUser={setNewUser}/>}
            <Post />
            <PostFeed />
        </div>

    )
}

export default Home