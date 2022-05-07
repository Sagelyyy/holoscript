import './Home.css'
import Post from './Post'
import SignUpModal from './SignUpModal'
import LoginModal from './LoginModal'
import { useUserAuth } from '../contexts/UserAuthContext'
import { useState } from 'react'

const Home = () => {

    const { authUser } = useUserAuth()
    const [newUser, setNewUser] = useState(false)

    return (
        <div className="home--container">
            <h1 style={{color: 'white'}}>Home</h1>
            <Post />
            { <SignUpModal newUser={newUser} setNewUser={setNewUser}/>}
            {!authUser ?<LoginModal newUser={newUser} setNewUser={setNewUser}/> : null}
        </div>

    )
}

export default Home